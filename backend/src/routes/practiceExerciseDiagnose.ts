import { Router } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { generateSocraticDiagnosis, isBharatCodeConfigured } from "../services/bharatCodeService.js";
import { prisma } from "../prisma.js";

const router = Router();

/** ──────────────────────────────────────────────────────────────────────────
 *  POST /api/practice-exercises/diagnose
 *
 *  Accepts failing test-case data from the frontend code editor and returns
 *  a Socratic diagnosis powered by BharatCode AI (or a safe mock response
 *  when no API key is configured).
 *
 *  Protected: requireAuth — students must be logged in.
 *  Rate-limited: 1 diagnosis per user per problem per 30 seconds (in-memory).
 * ──────────────────────────────────────────────────────────────────────────*/

// ─── In-memory rate limiter ─────────────────────────────────────────────────
// Key: `${userId}:${problemId}` → timestamp of last allowed request
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30_000; // 30 seconds

function isRateLimited(userId: string, problemId: string): boolean {
  const key = `${userId}:${problemId}`;
  const last = rateLimitMap.get(key) ?? 0;
  const now = Date.now();
  if (now - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(key, now);
  return false;
}

// Periodically clean up stale entries so the Map doesn't grow forever
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_MS * 10;
  for (const [key, ts] of rateLimitMap.entries()) {
    if (ts < cutoff) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1_000); // every 5 minutes

// ─── Zod validation schema ──────────────────────────────────────────────────
const FailingTestSchema = z.object({
  label: z.string().max(200),
  expected: z.string().max(500),
  actual: z.string().max(500),
  explanation: z.string().max(300).optional(),
});

const DiagnoseBodySchema = z.object({
  problemId: z.string().min(1).max(100),
  problemTitle: z.string().min(1).max(300),
  problemDescription: z.string().max(2000),
  studentCode: z.string().max(8000),
  failingTests: z.array(FailingTestSchema).min(1).max(20),
  hintLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

// ─── POST /diagnose ─────────────────────────────────────────────────────────
router.post(
  "/diagnose",
  requireAuth,
  async (req: AuthenticatedRequest, res, next): Promise<void> => {
    try {
      // Validate request body
      const parseResult = DiagnoseBodySchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          error: "Invalid request data.",
          details: parseResult.error.flatten().fieldErrors,
          errorType: "validation",
        });
        return;
      }

      const { problemId, problemTitle, problemDescription, studentCode, failingTests, hintLevel } =
        parseResult.data;

      const userId = req.user!.id;

      // Rate-limit check
      if (isRateLimited(userId, problemId)) {
        res.status(429).json({
          success: false,
          error: "Please wait 30 seconds before requesting another diagnosis for this problem.",
          errorType: "rate_limit",
        });
        return;
      }

      // Call the BharatCode service (or mock)
      const diagnosis = await generateSocraticDiagnosis({
        problemTitle,
        problemDescription,
        studentCode,
        failingTestCases: failingTests,
        hintLevel,
      });

      // Record hint request for analytics (fire and forget, don't block response)
      if (diagnosis.success) {
        prisma.bharatCodeHintRequest
          .create({
            data: {
              practiceAttemptId: problemId,
              userId,
              hintLevel: hintLevel ?? 1,
            },
          })
          .catch((err) => {
            console.error("[BharatCode] Failed to record hint request:", err);
          });
      }

      // Include whether we're in mock mode so the UI can show an indicator
      res.json({
        ...diagnosis,
        isConfigured: isBharatCodeConfigured(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/practice-exercises/record-submission ─────────────────────────────
// Records a practice submission and updates hint outcomes if the student passes
router.post(
  "/record-submission",
  requireAuth,
  async (req: AuthenticatedRequest, res, next): Promise<void> => {
    try {
      const submissionSchema = z.object({
        problemId: z.string(),
        passed: z.boolean(),
      });
      
      const { problemId, passed } = submissionSchema.parse(req.body);
      const userId = req.user!.id;

      if (passed) {
        // Update all pending hint requests for this user/problem to mark eventual success
        await prisma.bharatCodeHintRequest.updateMany({
          where: {
            practiceAttemptId: problemId,
            userId,
            eventualSuccess: false,
          },
          data: {
            eventualSuccess: true,
            succeededAt: new Date(),
          },
        });
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
