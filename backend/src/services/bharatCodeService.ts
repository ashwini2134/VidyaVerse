import { config } from "../config.js";

/** ──────────────────────────────────────────────────────────────────────────
 *  BharatCode Socratic Code Diagnostician — Service
 *
 *  Uses BharatCode's OpenAI-compatible /chat/completions endpoint.
 *  Falls back to MOCK MODE when BHARATCODE_API_KEY is not configured so that
 *  local development and CI always work without a live key.
 *
 *  Verified API spec (bharatcode.ai/build):
 *    Base URL : https://bharatcode.ai/api/model/v1
 *    Auth     : Authorization: Bearer <key>
 *    Model    : qwen-3.8-27b  (free tier — 10M tokens/day for students)
 *    Endpoint : POST /chat/completions  (OpenAI-compatible)
 * ──────────────────────────────────────────────────────────────────────────*/

export interface FailingTest {
  label: string;
  expected: string;
  actual: string;
  explanation?: string;
}

export interface DiagnosisParams {
  problemTitle: string;
  problemDescription: string;
  studentCode: string;
  failingTestCases: FailingTest[];
  hintLevel?: 1 | 2 | 3;
}

export type DiagnosisSuccess = {
  success: true;
  rootCause: string;
  evidence: string;
  conceptClue: string;
  guidingQuestion: string;
  nextStep: string;
  isMockMode: boolean;
};

export type DiagnosisFailure = {
  success: false;
  error: string;
  errorType: "config" | "rate_limit" | "timeout" | "upstream";
};

export type DiagnosisResult = DiagnosisSuccess | DiagnosisFailure;

// ─── Mock response used when no API key is configured ────────────────────────
const MOCK_RESPONSE: DiagnosisSuccess = {
  success: true,
  rootCause:
    "Your output doesn't match the expected result — this looks like a logical error in how you're producing or formatting the output.",
  evidence:
    "Compare your actual output character by character with the expected output to find the mismatch.",
  conceptClue:
    "Review how your loop or conditional produces each line of output and compare it step by step with what's expected.",
  guidingQuestion:
    "If you trace through your code manually with the first test input, what does each print() statement produce — and does that match the expected output line by line?",
  nextStep:
    "Run your code with the test input and print each intermediate value to see where the output diverges.",
  isMockMode: true,
};

// ─── System prompt — Socratic, never reveals the solution ────────────────────
function buildSystemPrompt(hintLevel: number = 1): string {
  const levelInstructions = {
    1: "Provide a GENTLE hint. Identify the relevant concept or area to inspect. Ask a guiding question. Do not reveal the exact correction immediately.",
    2: "Provide a TARGETED hint. Point to the relevant line, expression, output section, or concept. Explain what is inconsistent with the expected result. Encourage the student to make the correction.",
    3: "Provide STEP-BY-STEP guidance. Explain the debugging process in a short sequence. Use pseudocode or a conceptual example where helpful. Do not return the complete corrected submission or a ready-to-copy solution.",
  };

  return `You are a patient and encouraging code tutor for beginner Python students.
A student's code has failed one or more test cases.
Your ONLY job is to help them discover the bug themselves — do NOT fix the code, do NOT show the correct answer.

You will receive the student's code, the expected output, and the actual output.
Focus your diagnosis on the SPECIFIC differences between expected and actual results.

HINT LEVEL: ${hintLevel}
${levelInstructions[hintLevel as keyof typeof levelInstructions] || levelInstructions[1]}

Respond with EXACTLY this JSON object and nothing else (no markdown fences, no extra text):
{
  "rootCause": "<one concise sentence describing the type of bug, grounded in the actual difference between expected and actual output — e.g. 'missing colon in output format' or 'off-by-one in loop range' — never give the line number or corrected code>",
  "evidence": "<the exact relevant difference between expected and actual results, or the relevant error message — be specific but don't reveal the fix>",
  "conceptClue": "<the specific Python concept or built-in behaviour they need to revisit, e.g. 'print() adds a newline by default' or 'range() is exclusive of the stop value'>",
  "guidingQuestion": "<one Socratic question that nudges them toward the fix by referencing the actual mismatch, without revealing it>",
  "nextStep": "<one practical action the student can take to debug further, without giving the solution>"
}

Rules:
- Be encouraging. Assume the student is capable.
- Keep every field under 120 characters.
- Ground your diagnosis in the actual expected vs actual output provided.
- If the difference is a missing character (like a colon, comma, or space), mention the type of character without revealing the exact fix.
- If the difference is capitalization, mention case sensitivity without giving the correct case.
- Never include the correct output, correct code, or tell them exactly what to change.`;
}

// ─── Build the user message ──────────────────────────────────────────────────
function buildUserMessage(params: DiagnosisParams): string {
  const testSummary = params.failingTestCases
    .map((t, i) => {
      const exp = t.expected.slice(0, 200);
      const act = t.actual.slice(0, 200);
      const hint = t.explanation ? `\n  Diff note: ${t.explanation.slice(0, 120)}` : "";
      return `Test ${i + 1} — "${t.label}"\n  Expected: ${exp}\n  Got     : ${act}${hint}`;
    })
    .join("\n\n");

  return `Problem: ${params.problemTitle}
Description: ${params.problemDescription.slice(0, 500)}

Student's code:
\`\`\`python
${params.studentCode.slice(0, 3000)}
\`\`\`

Failing test cases:
${testSummary}`;
}

// ─── Call BharatCode /chat/completions ───────────────────────────────────────
async function callBharatCode(userMessage: string, hintLevel: number = 1): Promise<DiagnosisResult> {
  const { apiKey, baseUrl, model } = config.bharatCode;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000); // Increased to 30 seconds

  let res: Response;
  try {
    console.log(`[BharatCode] Calling API: ${baseUrl}/chat/completions with model: ${model}, hintLevel: ${hintLevel}`);
    const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '****';
    console.log(`[BharatCode] Using API key: ${maskedKey}`);
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(hintLevel) },
          { role: "user", content: userMessage },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort =
      err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    console.error("[BharatCode] Fetch error:", isAbort ? "Request timeout after 30s" : err);
    return {
      success: false,
      error: isAbort
        ? "The AI tutor took too long to respond. Please try again."
        : "Could not reach the BharatCode AI service. Check your network or try again later.",
      errorType: isAbort ? "timeout" : "upstream",
    };
  } finally {
    clearTimeout(timeoutId);
  }

  // ── HTTP error handling ────────────────────────────────────────────────────
  console.log(`[BharatCode] Response status: ${res.status}`);

  if (res.status === 401 || res.status === 403) {
    console.error("[BharatCode] Auth error — check BHARATCODE_API_KEY");
    return {
      success: false,
      error: "BharatCode API authentication failed. Please check your API key configuration.",
      errorType: "config",
    };
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get("retry-after") ?? "60";
    console.warn(`[BharatCode] Rate limited — retry after ${retryAfter}s`);
    return {
      success: false,
      error: `The AI tutor is temporarily busy. Please wait ${retryAfter} seconds and try again.`,
      errorType: "rate_limit",
    };
  }

  if (res.status === 402) {
    // Payment Required — BharatCode account needs a credit top-up.
    // Fall back to mock mode so students still get Socratic hints.
    console.warn("[BharatCode] HTTP 402 Payment Required — falling back to mock mode. Top up your BharatCode account to re-enable live AI.");
    return { ...MOCK_RESPONSE, isMockMode: true };
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "(unreadable)");
    console.error(`[BharatCode] HTTP ${res.status}: ${bodyText.slice(0, 200)}`);
    return {
      success: false,
      error: `The AI tutor returned an unexpected error (HTTP ${res.status}). Please try again.`,
      errorType: "upstream",
    };
  }


  // ── Parse JSON body ────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    const raw = await res.text().catch(() => "");
    console.error("[BharatCode] Non-JSON response:", raw.slice(0, 200));
    return {
      success: false,
      error: "The AI tutor returned an unreadable response. Please try again.",
      errorType: "upstream",
    };
  }

  // ── Extract model text content from OpenAI-compatible shape ───────────────
  const rawText: string =
    (body as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message
      ?.content ?? "";

  if (!rawText.trim()) {
    console.error("[BharatCode] Empty model response");
    return {
      success: false,
      error: "The AI tutor returned an empty response. Please try again.",
      errorType: "upstream",
    };
  }

  // ── Parse structured JSON from model output ────────────────────────────────
  // Strip possible markdown fences the model may add despite instructions
  const jsonCandidate = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed: { rootCause?: unknown; evidence?: unknown; conceptClue?: unknown; guidingQuestion?: unknown; nextStep?: unknown };
  try {
    parsed = JSON.parse(jsonCandidate);
  } catch {
    console.error("[BharatCode] Could not parse model JSON:", jsonCandidate.slice(0, 300));
    return {
      success: false,
      error: "The AI tutor's response was not in the expected format. Please try again.",
      errorType: "upstream",
    };
  }

  const rootCause = typeof parsed.rootCause === "string" ? parsed.rootCause.trim() : "";
  const evidence = typeof parsed.evidence === "string" ? parsed.evidence.trim() : "";
  const conceptClue = typeof parsed.conceptClue === "string" ? parsed.conceptClue.trim() : "";
  const guidingQuestion =
    typeof parsed.guidingQuestion === "string" ? parsed.guidingQuestion.trim() : "";
  const nextStep = typeof parsed.nextStep === "string" ? parsed.nextStep.trim() : "";

  if (!rootCause || !conceptClue || !guidingQuestion || !nextStep) {
    console.error("[BharatCode] Incomplete fields in model response:", parsed);
    return {
      success: false,
      error: "The AI tutor's response was incomplete. Please try again.",
      errorType: "upstream",
    };
  }

  return {
    success: true,
    rootCause,
    evidence: evidence || "Compare your output with the expected result to identify the mismatch.",
    conceptClue,
    guidingQuestion,
    nextStep,
    isMockMode: false,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Returns true when a live BharatCode API key is configured. */
export function isBharatCodeConfigured(): boolean {
  return Boolean(config.bharatCode.apiKey);
}

/**
 * Generates a Socratic code diagnosis using BharatCode AI.
 * Automatically falls back to a safe mock response when no API key is set.
 */
export async function generateSocraticDiagnosis(
  params: DiagnosisParams
): Promise<DiagnosisResult> {
  const hintLevel = params.hintLevel ?? 1;

  if (!isBharatCodeConfigured()) {
    console.log("[BharatCode] Running in MOCK MODE — no BHARATCODE_API_KEY set");
    return MOCK_RESPONSE;
  }

  const userMessage = buildUserMessage(params);
  console.log(
    `[BharatCode] Requesting diagnosis for problem: "${params.problemTitle}" (${params.failingTestCases.length} failing tests, hintLevel: ${hintLevel})`
  );

  const result = await callBharatCode(userMessage, hintLevel);

  if (result.success) {
    console.log(`[BharatCode] Diagnosis generated successfully (mock=${result.isMockMode})`);
  } else {
    console.warn(`[BharatCode] Diagnosis failed: ${result.errorType} — ${result.error}`);
  }

  return result;
}
