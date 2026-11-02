# VidyaVerse — LMS

A full-stack Learning Management System called **GyanSetu**. It teaches programming through
scroll-driven interactive lessons, gates progression on real demonstrated work, grades capstone projects with an
LLM, and issues verifiable certificates at the end.

| | |
|---|---|
| **Repository** | https://github.com/ashwini2134/VidyaVerse |
| **Version** | 3.0.0 — *Phase 3: Automated Student Pipeline* |
| **Courses live** | Python Beginner (14 lectures) · Fundamentals of AI (9 lectures) |

---

## Table of Contents

1. [What this is](#1-what-this-is)
2. [Repository layout](#2-repository-layout)
3. [Architecture](#3-architecture)
4. [Tech stack](#4-tech-stack)
5. [The student journey (how it actually works)](#5-the-student-journey-how-it-actually-works)
6. [Content model — how a lesson is built](#6-content-model--how-a-lesson-is-built)
7. [Authentication & authorization](#7-authentication--authorization)
8. [Progression & unlock rules](#8-progression--unlock-rules)
9. [Gamification: XP, streaks, achievements, ranks](#9-gamification-xp-streaks-achievements-ranks)
10. [The AI subsystems](#10-the-ai-subsystems)
11. [Projects & the automated review pipeline](#11-projects--the-automated-review-pipeline)
12. [Certification](#12-certification)
13. [Portfolio & resume](#13-portfolio--resume)
14. [Background jobs, queues & cron](#14-background-jobs-queues--cron)
15. [Notifications & email](#15-notifications--email)
16. [Admin: the Content Studio and beyond](#16-admin-the-content-studio-and-beyond)
17. [Database schema](#17-database-schema)
18. [API surface](#18-api-surface)
19. [Local development](#19-local-development)
20. [Environment variables](#20-environment-variables)
21. [Testing](#21-testing)
22. [Deployment](#22-deployment)
23. [Seeding & operational scripts](#23-seeding--operational-scripts)
24. [The certificate verification service (`certs/`)](#24-the-certificate-verification-service-certs)
25. [Known gaps & gotchas](#25-known-gaps--gotchas)
26. [Contributing](#26-contributing)

---

## 1. What this is

Most online courses are a video player next to a comment box. This one is built on a different premise: a student
should not be able to reach lecture 5 without having *actually done* lectures 1 through 4 — read every section,
completed the practice exercise, passed the quiz, and solved every coding problem.

The platform is therefore three things stitched together:

1. **A content renderer.** Lessons are JSON documents made of ~25 typed block kinds (text, code examples,
   analogies, interactive games, drag-and-drop classification, neural-network builders…). The React app maps each
   block type to a component. Adding a lecture means writing a `lesson.json` — no UI code.
2. **A progress engine.** Every scroll-section read, try-it block expanded, quiz attempt, problem solved, and
   project submitted is a row in PostgreSQL. Those rows are the single source of truth for what's unlocked, how
   much XP a student has, which achievements fired, and whether they've earned a certificate.
3. **An automated grader.** Capstone projects are submitted as GitHub URLs. The backend reads the actual
   repository source, runs a security scan and a validation pass, then sends the real code to Google Gemini
   against a rubric. Score ≥ 60 passes. When the AI is unavailable the submission is flagged `NEEDS_REVIEW` for a
   human — never silently passed or failed.

---

## 2. Repository layout

```text
LMS/
├── frontend/                     # React 19 + Vite 6 SPA — the entire UI
│   ├── public/
│   │   ├── data/                 # ★ COURSE CONTENT — source of truth (JSON)
│   │   │   ├── courses.json      #   the course catalog
│   │   │   ├── python20/         #   14 lectures
│   │   │   │   ├── lectures.json
│   │   │   │   └── lecture_N/lesson.json
│   │   │   └── fundamentals-of-ai/
│   │   │       ├── lectures.json
│   │   │       └── lecture_N/{lesson.json,quiz.json,problems.json,notes.md,project.md}
│   │   ├── branding/  images/  media/  static/  uploads/
│   │   └── CNAME                 # academy.fraylontech.com
│   └── src/
│       ├── App.tsx               # route table (all pages lazy-loaded)
│       ├── Shell.tsx             # authenticated app shell: header + sidebar
│       ├── auth.tsx              # AuthContext (user, ready, hasRole)
│       ├── authClient.ts         # token storage + authFetch() wrapper
│       ├── api.ts                # course-content data layer
│       ├── mentor.ts             # rule-based Socratic hint engine (2.2k lines)
│       ├── interpreter.ts        # step-debugger Python interpreter
│       ├── utils/pythonRunner.ts # in-browser Python execution (MT19937-accurate)
│       ├── components/
│       │   ├── lesson/           # ~70 lesson block renderers & interactive exercises
│       │   ├── admin/            # Content Studio, block editor, analytics
│       │   ├── landing/          # marketing page incl. Three.js scenes
│       │   ├── portfolio/        # 11 portfolio templates
│       │   ├── workspace/        # in-browser project IDE
│       │   └── xp/               # XP center, weekly graph, streak popover
│       ├── hooks/                # useLectureProgress, useCourseProgress, …
│       └── pages/                # ~60 route components
│
├── backend/                      # Express + Prisma API (ESM TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma         # ~50 models, PostgreSQL
│   │   └── migrations/
│   └── src/
│       ├── index.ts              # web entrypoint (Express + optional in-proc workers)
│       ├── worker.ts             # dedicated worker entrypoint (no HTTP)
│       ├── app.ts                # createApp(): middleware + all route mounts
│       ├── config.ts             # env → typed config object
│       ├── routes/               # 40+ routers (student + admin)
│       ├── services/             # business logic (certification, AI review, XP, email…)
│       ├── workers/              # BullMQ job processors
│       ├── achievements/         # catalog + evaluation engine
│       ├── cron/                 # scheduled jobs
│       ├── lib/                  # queue, GitHub fetch, course lectures, skill map
│       ├── middleware/           # requireAuth, requireRole, errorHandler
│       ├── seeds/                # seed scripts
│       └── utils/                # jwt, password, tokens, quiz validation
│
├── certs/                        # Separate Next.js 14 app — public cert verification
│                                 # (Supabase + Upstash + Puppeteer PDF rendering)
├── content/                      # LEGACY duplicate of frontend/public/data — do not extend
├── scripts/                      # repo-level tooling
├── .github/workflows/deploy.yml  # frontend → gh-pages
├── DEPLOYMENT_CHECKLIST.md       # the authoritative deploy runbook
├── CHANGELOG.md                  # phase-by-phase history
└── CONTRIBUTING.md               # branch naming, PR rules, team workflow
```

> **Note on `content/`:** it is a legacy copy of the course data. `frontend/public/data/` is the real source of
> truth — the frontend fetches it over HTTP *and* the backend reads it off disk (`lib/courseLectures.ts`).

---

## 3. Architecture

```text
                            ┌──────────────────────────────┐
   Browser  ───────────────▶│  frontend/  React 19 SPA     │
                            │  Vite build → static assets  │
                            └──────────────┬───────────────┘
                                           │  fetch /api/*   (Bearer access token
                                           │                  + httpOnly refresh cookie)
                            ┌──────────────▼───────────────┐
                            │  backend/  Express API       │      Service 1 (web)
                            │  helmet · cors · rate-limit  │      DISABLE_WORKERS=true
                            │  Zod validation · Prisma     │
                            └───┬──────────────────────┬───┘
                                │                      │
                    ┌───────────▼──────────┐   ┌───────▼────────────────┐
                    │  PostgreSQL          │   │  Redis (BullMQ)        │
                    │  ~50 Prisma models   │   │  5 queues              │
                    └──────────────────────┘   └───────▲────────────────┘
                                                       │
                            ┌──────────────────────────┴───┐
                            │  backend/  worker process    │      Service 2 (worker)
                            │  job processors + node-cron  │
                            └──────┬───────────┬───────────┘
                                   │           │
                    ┌──────────────▼──┐  ┌─────▼──────────────┐
                    │ Google Gemini   │  │ Resend / SMTP      │
                    │ 2.0 Flash       │  │ email delivery     │
                    │ (code review)   │  └────────────────────┘
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────┐
                    │ GitHub API (repo fetch)     │
                    └─────────────────────────────┘

    Groq llama-3.3-70b  ◀── /api/chat  (AI tutor)
    certs/ (Next.js on Vercel)  ◀── public QR certificate verification
```

**Two-process split.** The same codebase boots two different ways. `src/index.ts` starts Express; `src/worker.ts`
starts only queue processors and cron. On Railway, the web service sets `DISABLE_WORKERS=true` so it serves HTTP
only, and a second service runs `npm run start:worker`. In local development a single `npm run dev` runs Express
*and* the workers in-process, so you don't need two terminals.

**Content lives outside the database (mostly).** The two shipped courses' lecture content is static JSON in
`frontend/public/data/`. The DB stores *progress against* that content, plus admin-authored courses created in the
Content Studio (`Course`/`Lesson`/`Quiz`/`CourseProject` models). This dual-source design is deliberate — the
static path is fast, diffable in git, and reviewable in a PR; the DB path is what the Content Studio writes to.

---

## 4. Tech stack

### Frontend

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 6, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) + CSS custom-property design tokens |
| Routing | React Router DOM 7, every page `React.lazy`-loaded |
| Code editing | `@monaco-editor/react` (student IDE), TipTap 3 (admin rich text) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` |
| 3D / motion | `@react-three/fiber` + `drei` + `three` (landing page), `framer-motion` |
| Drag & drop | `@dnd-kit/core` + `sortable` |
| Icons | `lucide-react` |
| Syntax highlight | `react-syntax-highlighter`, `lowlight` |
| Testing | Vitest 4 + Testing Library + jsdom |

### Backend

| Concern | Choice |
|---|---|
| Runtime | Node ≥ 20.11, ESM (`"type": "module"`) |
| HTTP | Express 4 |
| ORM / DB | Prisma 7 + PostgreSQL (`@prisma/adapter-pg`) |
| Validation | Zod 3 at every request boundary |
| Auth | `jsonwebtoken` + `bcryptjs`, httpOnly refresh cookies |
| Security | `helmet`, `cors` allowlist, `express-rate-limit` |
| Queues | BullMQ 5 + `ioredis` |
| Scheduling | `node-cron` |
| AI | `@google/generative-ai` (Gemini 2.0 Flash), Groq REST (llama-3.3-70b-versatile) |
| Email | `resend` (primary) → `nodemailer`/SMTP (fallback) |
| Files / docs | `multer`, `archiver`, `pdf-lib`, `qrcode` |
| Dev / test | `tsx` (watch mode), Vitest 3 + `supertest` |

---

## 5. The student journey (how it actually works)

### 5.1 Landing → account

An unauthenticated visitor at `/` gets `LandingPage` — a long marketing page with parallax, Three.js icons, and
course discovery. Authenticated users hitting the same path get the app `Shell` instead. That branch lives in
`LandingOrDashboardGuard` (`frontend/src/App.tsx`).

Registration is email + password (+ optional GitHub URL), or one-click OAuth via GitHub, Google, or LinkedIn.

### 5.2 Dashboard

`/` (authenticated) shows enrolled courses with progress rings, current streak, XP and rank, daily missions,
recent achievements, and the activity heatmap.

### 5.3 Course page

`/course/:slug` lists every lecture with one of three states — **completed**, **available**, **locked**. A locked
lecture is un-clickable and captioned *"Complete Lecture N to unlock"*. Admins bypass locking entirely
(`isAdmin` check in `CoursePage.tsx`), which is how content can be reviewed without grinding through it.

### 5.4 Lecture page — the core experience

`/course/:slug/lecture/:number` renders `lesson.json` as a **scroll-driven progressive reveal**. The lesson is
divided into named sections; each section is a list of typed blocks. As the student scrolls a section into view
and reaches its end, the section is marked complete (`PATCH /api/progress/lecture/:courseSlug/:lectureId` with a
`sectionIndex`) and **10 XP** is awarded.

Blocks are not passive text. Depending on the lecture a student will hit:

- **Try It Yourself** (`code_example`) — an editable code block that runs in a real in-browser Python
  interpreter. Time spent with it expanded is tracked (`TryItEngagement`) and feeds certification grading.
- **Think Of** (`think_of`) — a real-world analogy staged into an animated multi-step explanation.
- **Practice** (`practice`) — a graded exercise: drag-and-drop, classification, path building, BFS/DFS games,
  neural-network builders, k-means clustering, hill climbing, tokenization, and ~40 more purpose-built widgets.
- **AI sections** (`ai_section`, `ai_think_of`, `ai_challenge_set`) — exercises where the student converses with
  the AI tutor and their prompt/response is evaluated against criteria.

### 5.5 Quiz

`/course/:slug/lecture/:number/quiz`. Multiple-choice with per-question explanations shown on review. A pass
awards **30 XP**, records a `QuizAttempt` row, and enqueues a certificate-eligibility check. Retakes are allowed —
the eligibility engine collapses all attempts per lecture down to the best one.

### 5.6 Problems

Coding problems attached to a lecture. Solving one records a `Submission` with `status: PASSED` and awards
**20 XP**. Auto-generated "similar question" variants (ids ending `_sim1`/`_sim2`) are excluded from certification
counting so practice repetition can't inflate a student's totals.

### 5.7 Milestones & capstone

For the AI course, `/course/:slug/lecture/:number/milestone` offers project milestones (Degrees, Tic-Tac-Toe,
Knights, Minesweeper, PageRank, Heredity, Crossword, Shopping, Nim, Traffic). Each milestone "slot" is satisfied
by any *one* of its listed projects — the student chooses.

`/course/:slug/capstone` is the final project: pick one from a shortlist, build it, push to GitHub, submit the
URL. It goes through the same automated review pipeline as everything else.

### 5.8 Certification readiness → certificate

`/course/:slug/certification-readiness` renders a live per-lecture checklist computed by
`certificationService.checkEligibility()`. When every condition passes, the certificate worker issues a
certificate with a unique number, and the student can download the PDF, share to LinkedIn, or hand out the public
verification URL.

---

## 6. Content model — how a lesson is built

Every lecture is one `lesson.json`:

```jsonc
{
  "id": "python20-lecture-1",
  "courseSlug": "python20",
  "number": 1,
  "title": "Variables & Data Types",
  "overview": "Every program works with data…",
  "estimatedMinutes": 55,
  "sections": [
    {
      "id": "variables",
      "label": "What is a Variable?",
      "blocks": [ /* typed content blocks — see table below */ ]
    }
  ],
  "summary": {
    "keyTakeaways": ["…"],
    "whatYouLearned": ["…"],
    "nextUp": "…"
  },
  "quiz":     [ { "question": "…", "options": ["…"], "answer": 0, "explanation": "…" } ],
  "problems": [ { "id": "…", "title": "…", "description": "…", "difficulty": "Easy",
                  "starterCode": "…", "solution": "…", "testCases": [] } ]
}
```

### Block types in use across the shipped courses

| Block `type` | Count | Renders as |
|---|---:|---|
| `text` | 708 | Markdown paragraph |
| `heading` | 282 | Section heading |
| `list` | 84 | Bulleted / numbered list |
| `practice` | 72 | Interactive graded exercise |
| `code_example` | 66 | "Try It Yourself" runnable editor |
| `think_of` | 47 | Staged real-world analogy |
| `explanation` | 46 | Accent-coloured explainer card |
| `flow` | 43 | Step-flow diagram |
| `callout` | 42 | Tip / warning / note |
| `ai_think_of` | 35 | AI-assisted analogy exercise |
| `svg_placeholder` | 32 | Concept illustration |
| `ai_section` | 18 | AI conversation exercise |
| `categories` | 12 | Category-sorting widget |
| `decision` | 8 | Decision-tree visual |
| `image` · `code` · `ai_challenge_set` | 5 each | Image · static code · AI challenge set |
| `analogy` · `repetition` · `classify` | 4 each | Analogy card · loop visual · classifier |
| `reflection` · `comparison` | 2 each | Reflection prompt · side-by-side |
| `toggle` · `infographic` · `rules_vs_learning` | 1 each | Specialist one-offs |

Types are defined in `frontend/src/types/lesson.ts` and dispatched by
`frontend/src/components/lesson/LessonSection.tsx`. **Adding a lecture requires zero UI changes** as long as you
only use existing block types.

### Manifests

| File | Shape |
|---|---|
| `data/courses.json` | `[{ slug, title, description, level, category, language, badge? }]` |
| `data/{slug}/lectures.json` | `[{ number, label, title }]` |
| `data/{slug}/lecture_N/lesson.json` | the document above |
| `data/{slug}/lecture_N/quiz.json` | standalone quiz (AI course) |
| `data/{slug}/lecture_N/problems.json` | standalone problem set (AI course) |
| `data/{slug}/lecture_N/notes.md` | supplementary Markdown notes |

> **Numbering gotcha.** `python20` lecture folders are 0-indexed and its internal ids match. `fundamentals-of-ai`
> folders are 1-indexed (`lecture_1`…`lecture_9`) but its internal quiz/lesson ids are 0-indexed
> (`fundamentals-of-ai-lecture-0`…`-8`). `backend/src/lib/courseLectures.ts::toInternalLectureIndex()` is the one
> place that conversion happens — use it, don't re-derive it.

---

## 7. Authentication & authorization

### Token flow

```text
POST /api/auth/register  ──▶  bcrypt hash → User row
POST /api/auth/login     ──▶  { accessToken }  +  Set-Cookie: fa_refresh_token (httpOnly)
                              access  : JWT, 15 min, { sub, email, role, type:"access" }
                              refresh : JWT, 30 days, { sub, jti, type:"refresh" }
                                        jti is hashed into the RefreshToken table
POST /api/auth/refresh   ──▶  verifies the signature AND that the hashed jti is
                              un-revoked and unexpired in the DB → new access token
POST /api/auth/logout    ──▶  revokes that refresh token row
```

Storing a hash of the refresh token's `jti` server-side is what makes logout and "revoke all sessions" real —
a stolen refresh token stops working the moment its row is revoked. The cookie is scoped to `path=/api/auth`,
`httpOnly`, `secure` outside development, and `sameSite=none` in production (cross-origin frontend).

### Middleware

- `requireAuth` — parses `Authorization: Bearer …`, verifies the access token, re-loads the user from the DB
  (so a deleted or demoted user is rejected immediately), attaches `req.user`.
- `requireRole(...roles)` — role gate. Roles are `student` and `admin`.

The frontend mirrors this with `<RequireRole>` and `<AdminRoute>` wrappers, but the *authoritative* check is
always server-side.

### OAuth

GitHub, Google, and LinkedIn. `GET /api/auth/oauth/:provider` builds the authorize URL with a state cookie;
`GET /api/auth/oauth/:provider/callback` exchanges the code, finds-or-creates the user, then issues a **one-time
exchange code** rather than putting tokens in a redirect URL. The SPA lands on `/auth/oauth`, calls
`POST /api/auth/oauth/exchange`, and gets its tokens over a normal JSON response. Providers with no configured
client ID are simply unavailable — the app degrades to email/password.

### Rate limiting & other hardening

- Auth endpoints: 60 requests / 15 minutes per IP.
- `helmet()` on every response; CORS restricted to an explicit origin allowlist plus `FRONTEND_URL`.
- JSON body cap of 5 MB.
- Password reset via single-use hashed tokens (`PasswordResetToken`), emailed out.
- Every request body is Zod-parsed; `ZodError` maps to HTTP 400 in the global error handler.

---

## 8. Progression & unlock rules

This is the heart of the platform, and it's stricter than it looks.

A lecture *N* is unlocked **iff lecture N−1 is fully complete**, where "fully complete" is evaluated server-side
in `GET /api/progress/course/:courseSlug` and means **all four** of:

| Requirement | Backing data |
|---|---|
| Every section read | `Progress.status === "COMPLETED"` |
| Practice exercise completed | `Progress.practiceCompleted === true` |
| Quiz passed (if the lecture has one) | a `QuizAttempt` with `passed: true` for `{courseSlug}-lecture-{internalIndex}` |
| Every real problem solved (if any) | a `PASSED` `Submission` for each required `problemId` |

The endpoint returns `fullyCompletedLectures: number[]`, and the frontend hook
`useCourseProgress().isLectureUnlocked(n)` is simply `fullyCompletedLectures.has(n - 1)`.

Two deliberate carve-outs:

- The course's **first** lecture is always unlocked (the hook doesn't know each course's lecture list, so
  `CoursePage` handles this).
- **Admins bypass locking**, so content can be reviewed end-to-end.

The hook also exposes `loaded`, and `LecturePage`'s lock-enforcement redirect waits on it — otherwise the first
render (before progress has been fetched) would see an empty set and bounce a student out of a lecture they had
legitimately unlocked.

---

## 9. Gamification: XP, streaks, achievements, ranks

### XP awards

| Action | XP |
|---|---:|
| Section completed | 10 |
| Problem solved | 20 |
| Quiz passed | 30 |
| Full lecture completed | 50 |
| Capstone project completed | 100 |
| Course completed | 200 |

**Weekend multiplier:** actions on Saturday or Sunday earn **1.5×**, and the transaction is labelled
"*(Weekend Bonus)*". Every award is idempotent — `XpTransaction` has a unique `(userId, actionId)` constraint, so
re-completing the same section never double-pays.

### Streaks

`awardXp()` doubles as the streak engine. Earning XP on a calendar day after having last been active *yesterday*
increments `currentStreak`; a gap resets it to 1. `longestStreak` is high-watermarked. Milestone streaks
(**3, 7, 14, 30, 60, 100, 365** days) fire a notification. Users hold `streakFreezeCount` freezes to survive a
missed day.

### Weekly XP

`WeeklyXp` rows track XP per week, powering the XP Center's weekly graph and previous-week comparison.
Milestones at **500, 1 000, 2 500, 5 000** weekly XP fire notifications.

### Achievements

**55 achievements** defined in `backend/src/achievements/catalog.ts` — a single source of truth. Each entry is:

```ts
{
  id: "first_lecture",
  name: "First Steps",
  description: "Complete your first lecture",
  icon: "target",                 // maps to frontend/src/lib/achievementIcons.ts
  category: "learning",
  condition: { kind: "metric_gte", metric: "lecturesCompleted", threshold: 1 },
  xpReward: 10,
  badgeColor: "bronze",
  visibility: "visible"
}
```

`achievements/evaluationEngine.ts` re-evaluates conditions after each progress action and returns newly unlocked
achievements in the API response; the frontend fires a `fraylon:achievement:unlocked` window event that the
toast provider picks up. Adding an achievement is one catalog entry — it appears on the dashboard, course page,
and share links with no frontend change (unless it needs a brand-new icon key).

> The first 12 ids in the catalog are marked **LEGACY** — real users already hold unlocked rows against them.
> Never rename or remove those ids.

### Ranks

| XP | Title |
|---:|---|
| 0 | Beginner |
| 100 | Explorer |
| 500 | Builder |
| 1 000 | Master |
| 2 000 | Grandmaster |
| 5 000 | Legend |

### Leaderboard

Ranked by XP, with deterministic tie-breaks cascading through streak → problems solved → courses completed →
projects completed → account age. It also reports rank *movement*, so students see whether they're climbing.

### Daily missions

Per-user daily objectives stored in `DailyMission`, surfaced on the dashboard.

---

## 10. The AI subsystems

There are **four distinct** AI/analysis systems here. They are easy to confuse, so:

### 10.1 Gemini 2.0 Flash — project code review

`backend/src/services/aiReviewService.ts`. Given a submission, it prefers to fetch the *actual repository source*
via the GitHub API (`lib/githubRepoFetcher.ts`) rather than trusting the student's written description, then
prompts Gemini with the project requirements and the concatenated source files, demanding strict JSON back:

```json
{ "overallScore": 85, "maxScore": 100, "passed": true,
  "overallFeedback": "…", "strengths": ["…"], "improvements": ["…"],
  "criteriaScores": [{ "criteria": "Functionality", "score": 85, "maxScore": 100, "comment": "…" }] }
```

If `GOOGLE_AI_API_KEY` is missing, or the call fails, or no source could be read, the result is
`{ status: "unavailable" }` — **which is never treated as a pass or a fail**. The submission becomes
`NEEDS_REVIEW`, gets flagged, and the student is told a human will look at it.

### 10.2 Groq llama-3.3-70b-versatile — the AI tutor

`backend/src/services/gemini.ts` (the filename is a historical artifact — it calls **Groq**, not Gemini). Used by
chat and by the AI-workspace practice exercises. The system prompt hard-caps answers at two sentences, forbids
bullet points, and enforces a beginner-friendly register. Requires `GROQ_API_KEY`; without it the endpoint returns
a clear "not configured" message rather than failing.

### 10.3 GyanSetu Mentor — rule-based Socratic hints

`frontend/src/mentor.ts`, ~2 200 lines, **no LLM involved**. It statically analyses student code (strips comments,
detects function definitions, returns, prints, inputs, imports, classes, TODO stubs, keyword usage) and matches
against per-problem conceptual requirements to emit a targeted Socratic question. Designed hard against false
positives — it can tell a comment that *says* something from code that *does* it. Exposes `getMentorHint`,
`getFailureAnalysis`, `getProgressiveHints`, and `reviewStudentCode`.

### 10.4 In-browser Python — `interpreter.ts` + `utils/pythonRunner.ts`

A hand-written Python subset interpreter that runs entirely client-side, so "Try It Yourself" blocks and coding
problems execute with no server round-trip and no sandbox infrastructure. Two notable properties:

- It produces **real-looking CPython error messages**, so debugging practice is authentic.
- It ships a **bit-exact MT19937** implementation matching CPython's `_randommodule.c`, so `random.seed(n)`
  yields the identical sequence a real Python interpreter would — which is what makes randomised exercises
  deterministically gradeable.

`interpreter.ts` additionally emits a `DebugStep[]` trace (line, variables, outputs) to drive the step-debugger UI.

---

## 11. Projects & the automated review pipeline

### Submission

A student submits a project as a **GitHub URL** (plus optional written content). This creates a
`ProjectSubmission` with `status: PENDING` and enqueues a `project-review` job.

### The pipeline

```text
PENDING → REVIEWING
   │
   ├─ Step A · Security check      ── fail ─▶ REJECTED  (+ notification)
   │     scans for eval / exec / os.system and similar patterns
   │
   ├─ Step B · Validation check    ── fail ─▶ REJECTED  (+ notification)
   │     repo reachable, required files present, requirements addressed
   │
   └─ Step C · AI quality review (Gemini, real repo source)
         ├─ unavailable ─▶ NEEDS_REVIEW  (isFlagged, human review queue)
         ├─ passed:false ─▶ REJECTED     (score + itemised feedback)
         └─ passed:true  ─▶ APPROVED
                             ├─ portfolio updated
                             ├─ achievements re-evaluated
                             └─ certificate eligibility check enqueued
```

Every step's raw result is persisted on the submission (`securityCheck`, `validationCheck`, `aiReview`,
`reviewSteps`) so admins can audit exactly why a verdict was reached. Admins can override a verdict —
`isOverridden`, `overriddenBy`, `overrideReason`, `overriddenAt` record who did it and why.

### The in-browser project workspace

`/course/:slug/lecture/:number/project/:projectId` is a full IDE built from
`frontend/src/components/workspace/`: file explorer, Monaco editor, live preview, bottom console, requirements
panel, task navigator with per-task progress, resources panel, and an AI mentor card. Files persist per user
(`ProjectFile`), task completion persists as `ProjectTaskProgress`, and the whole project can be downloaded as a
zip (`archiver`).

---

## 12. Certification

`backend/src/services/certificationService.ts` is the gate. `checkEligibility(userId, courseSlug)` evaluates:

| Condition | Requirement |
|---|---|
| `lecturesCompleted` | all lectures (`python20`: 14, `fundamentals-of-ai`: 9) |
| `practiceCompleted` | practice done in every lecture |
| `tryItEngaged` | ≥ 20 cumulative seconds on try-it blocks, per lecture that has them |
| `quizzesPassed` | one passing quiz per lecture (best attempt counts) |
| `problemsSubmitted` | all real problems (`python20`: 42, `fundamentals-of-ai`: 21) |
| `finalProjectApproved` | an APPROVED capstone scoring **≥ 60** |
| `milestonesCompleted` | *(AI course only)* all 6 milestone slots satisfied |

Notes on the arithmetic:

- **Quiz retakes are collapsed** to one best attempt per lecture before counting, so a retaken quiz can't push
  the "done" count past the lecture total.
- **`_sim1`/`_sim2` problem variants are excluded** from the problem count.
- A milestone slot is satisfied by an approved submission for **any one** of its listed projects.
- The try-it requirement is automatically a no-op for `fundamentals-of-ai`, whose renderer suppresses
  `code_example` blocks — so the requirement is zero-of-zero rather than unreachable.
- Legacy submissions with no recorded numeric score fall back to "approved implies passed", so early students
  aren't retroactively failed.

Overall score = the average of mean quiz score and capstone score.

### Issuance & verification

Certificates are issued by the `certificate` queue worker, which is idempotent (a unique `(userId, courseSlug)`
guard prevents double issue). Once issued:

| Endpoint | Purpose |
|---|---|
| `GET /api/certifications/verify/:certNumber` | **public** verification (404 + `{valid:false}` when unknown) |
| `GET /api/certifications/:certNumber/download` | PDF |
| `GET /api/certifications/:certNumber/badge` | SVG digital badge |
| `POST /api/certifications/:certNumber/share` | LinkedIn share URL |
| `PATCH /api/certifications/:certNumber/template` | change certificate template |
| `GET /api/certifications/:courseSlug/readiness` | the live readiness checklist |

Ownership is verified before share/template actions. If `CERTS_APP_URL` + `CERTS_BEARER_TOKEN` are configured,
issuance delegates to the external `certs/` service; otherwise the certificate is issued locally to the database.

---

## 13. Portfolio & resume

Every student gets an auto-maintained portfolio at `/portfolio` (public view: `/portfolio/:userId`).

- **Auto-updating.** `lib/portfolioUpdater.ts` writes to `StudentPortfolio` whenever a project is approved, a
  capstone is approved, or a certificate is issued — the student never has to remember to add anything.
- **11 templates.** Bento, Minimal, Editorial, Sidebar, Journey, Ledger, Atelier, Story, Terminal, Resume, and
  the template gallery with live preview (`components/portfolio/templates/`). Selection persists on
  `User.portfolioTemplate`.
- **GitHub activity.** `GET /api/portfolio/github-activity` renders a contribution chart from the student's
  linked GitHub account.
- **Completeness nudges.** `completeness.ts` scores how filled-in a portfolio is and prompts for the gaps.
- **Spotlight.** `/spotlight` surfaces standout portfolios across the cohort.
- **Resume export.** `routes/resume.ts` generates a downloadable resume from portfolio data.
- **Visibility control.** `User.profileVisibility` gates whether the public route resolves.

---

## 14. Background jobs, queues & cron

Five BullMQ queues:

| Queue | Processor | Concurrency | Triggered by |
|---|---|---:|---|
| `quizGrading` | `quizGradingWorker` | 5 | quiz submission |
| `project-review` | `projectReviewWorker` | 2 | project submission |
| `capstoneReview` | `capstoneReviewWorker` | 2 | capstone submission |
| `certificate` | `certificateWorker` | 3 | quiz pass, project approval, capstone approval |
| `notification` | `notificationWorker` | 10 | any `sendNotification()` with email enabled |

**Cron:** daily at **09:00**, `cron/inactivityCron.ts` finds students inactive for more than 3 days and sends a
"We miss you" nudge. Test/example email domains are filtered out.

### ⚠️ The queues currently run inline, not through Redis

`backend/src/lib/queue.ts` exports **mocked producers** — `.add()` logs and returns a fake job id; it does not
push to Redis. To keep the platform functional rather than silently dropping work, `workers/workers.ts`
monkey-patches each queue's `.add()` at startup so the corresponding processor runs **inline via `setImmediate`**
in the same process.

This is documented in-code and is a known, deliberate interim state:

- ✅ Everything works — reviews run, certificates issue, emails send.
- ❌ No retries, no backoff, no job persistence across restarts, no cross-process distribution.
- ❌ Setting `REDIS_URL` does *not* currently switch it to real BullMQ; the workers log a message and still run
  inline, precisely so jobs aren't dropped.

Restoring real queueing means making `queue.ts` produce genuine BullMQ jobs against a provisioned Redis and
registering real `Worker` instances — a contained change, but one that needs a live Redis to verify against.
Until then, running the separate Railway worker service is harmless but not load-bearing for the web process.

---

## 15. Notifications & email

`services/notificationService.ts` is the single funnel. `sendNotification(userId, type, title, body, link,
priority, dedupeKey?)`:

1. Writes an `InAppNotification` row (unless the user's preferences opt out of that category).
2. Enqueues an email job (unless the user's email preferences opt out).

27 notification types are mapped to per-user preference keys (`emailQuizResults`, `inAppProjectReviews`, …) held
in `User.notificationPrefs`. A `dedupeKey` with a unique DB constraint prevents duplicate notifications for the
same event.

Email delivery order: **Resend** (`RESEND_API_KEY`) → **SMTP/nodemailer** (`SMTP_HOST` + `SMTP_USER`) → no-op with
a warning. Admins can edit templates in Settings → Email Templates (`EmailTemplate` model).

---

## 16. Admin: the Content Studio and beyond

Admin lives under `/admin/*`, guarded by `<AdminRoute>` on the client and `requireAuth + requireRole('admin')` on
every corresponding API route.

### Content Studio — the authoring pipeline

```text
/admin/content-studio                        course list
  └─ /:courseId/blueprint    Blueprint Builder  — structure, lectures, learning outcomes
  └─ /:courseId/lessons      Lesson Editor      — block-based WYSIWYG (13 block editors)
  └─ /:courseId/exercise     Exercise Builder   — practice exercises + validation rules
  └─ /:courseId/quiz         Quiz Builder       — questions, options, explanations
  └─ /:courseId/project      Project Builder    — project spec, rubric, starter files
  └─ /:courseId/publish      Course Publishing  — pre-publish checklist, DRAFT → PUBLISHED
  └─ /:courseId/versions     Version History    — CourseVersion snapshots + rollback
  └─ /:courseId/beta         Beta Testing       — beta testers + structured feedback
```

The block editor (`components/admin/block-editor/`) has dedicated editors for heading, text, list, code, image,
video, callout, analogy, explanation, think-of, quiz, exercise, and practice blocks — it writes the same JSON
shape the student renderer consumes.

### Other admin surfaces

| Route | What it does |
|---|---|
| `/admin/analytics` | Global dashboard plus course, exercise, assessment, certificate, and AI-review analytics; mastery distribution, score distribution, hardest questions, retry analysis, AI accuracy trend |
| `/admin/operations` | Job monitor, health cards, quick stats, AI review logs, blocked students |
| `/admin/settings` | Branding, AI configuration, email templates, roles & permissions, integrations |
| `/admin/testing` | General LMS test center |
| `/admin/course-testing` | Course content test center (+ Python-specific variant) |
| `/admin/lms-testing` | LMS core test center |
| `/admin/content-assessments` | Assessment builder |

### Branding

`GET /api/admin/branding` is **intentionally public** — every visitor's browser needs the platform name, primary
and secondary colours, and favicon to render the shell. `app.ts` mounts it *before* the blanket admin routers
specifically because those apply a catch-all auth guard across their whole mount path and would otherwise
intercept it. That ordering is load-bearing; don't reshuffle those mounts casually.

### Review queue

The admin review-queue routes surface submissions the AI couldn't judge (`NEEDS_REVIEW`), letting an admin
approve, reject, or override with a recorded reason.

---

## 17. Database schema

PostgreSQL via Prisma, **~50 models**. Grouped by concern:

| Group | Models |
|---|---|
| **Identity** | `User`, `OAuthAccount`, `RefreshToken`, `PasswordResetToken`, `OAuthExchangeCode`, `RoleChangeHistory` |
| **Progress** | `Progress`, `LectureProgress`, `TryItEngagement`, `StudentProgress` |
| **Assessment** | `QuizAttempt`, `Submission`, `AssessmentQuestion`, `Assessment`, `AssessmentProgress`, `PracticeExercise`, `PracticeAttempt`, `PracticeSubmission` |
| **Projects** | `Project`, `ProjectFile`, `ProjectTaskProgress`, `ProjectTemplate`, `ProjectSubmission`, `ReviewQueue` |
| **Gamification** | `Achievement`, `XpTransaction`, `WeeklyXp`, `DailyMission` |
| **Certification** | `IssuedCertificate`, `Certificate`, `StudentPortfolio` |
| **Authored content** | `Course`, `Lesson`, `Exercise`, `Quiz`, `QuizQuestion`, `CourseProject`, `CourseVersion` |
| **Beta** | `BetaTester`, `BetaFeedback` |
| **Platform config** | `BrandingSettings`, `AIConfiguration`, `EmailTemplate`, `WebhookEndpoint`, `WebhookDelivery` |
| **Comms** | `InAppNotification`, `ChatMessage`, `CodeDraft` |
| **Access** | `InviteCode`, `RedeemedCode` |

`User` cascades on delete to essentially everything, so account deletion is clean.

Notable uniqueness constraints that carry real logic:

- `XpTransaction(userId, actionId)` — idempotent XP.
- `Progress(userId, courseSlug, lectureId)` — one progress row per lecture.
- `LectureProgress(userId, courseSlug, lectureId, sectionIndex)` — one row per section.
- `IssuedCertificate(userId, courseSlug)` — one certificate per course per student.
- `InAppNotification.dedupeKey` — no duplicate notifications.
- `PracticeExercise(courseId, lectureId, sectionId, type)` — one exercise per slot.

---

## 18. API surface

All routes are prefixed `/api`. `GET /api/health` is the only unauthenticated non-public-feature endpoint.

### Student-facing

| Mount | Highlights |
|---|---|
| `/auth` | `register`, `login`, `logout`, `refresh`, `me`, `profile`, `forgot-password`, `reset-password`, `oauth/:provider[/callback]`, `oauth/exchange` |
| `/progress` | `GET /`, `POST /`, `overall`, `me`, `leaderboard`, `profile/public/:userId`, `quiz`, `section`, `tryit`, `lecture`, `action`, `lecture/:courseSlug/:lectureId` (GET + PATCH), `course/:courseSlug`, `activity` |
| `/courses` | `GET /`, `progress`, `:slug/lessons/:num` |
| `/quiz`, `/quiz-attempts` | submit, attempt history |
| `/projects`, `/projects/tasks`, `/student/projects` | templates, files, download, complete, start, status |
| `/practice-exercises` | `generate`, `:courseId/:lectureId/submit`, `status`, `config` |
| `/assessments` | assessment player + progress |
| `/certifications` | listed in [§12](#12-certification) |
| `/portfolio`, `/resume` | portfolio CRUD, sync, stats, timeline, github-activity, spotlight, public view, download |
| `/xp`, `/xp-center`, `/streaks`, `/achievements`, `/daily-missions` | gamification |
| `/chat` | AI tutor conversation per problem |
| `/drafts` | per-user code drafts |
| `/notifications`, `/notifications/in-app`, `/push-notifications`, `/email-digest` | comms |
| `/qa`, `/invites`, `/profile` | Q&A, invite codes, profile |

### Admin-only (`requireRole('admin')`)

`/admin/health` · `/admin/courses` · `/admin/branding` *(public read)* · `/admin/lessons` · `/admin/exercises` ·
`/admin/quiz` · `/admin/projects` · `/admin/versions` · `/admin/beta` · `/admin/operations` · `/admin/ai-config` ·
`/admin/email-templates` · `/admin/roles` · `/admin/integrations` · `/admin/jobs` · `/admin/students` ·
`/admin/ai-reviews` · `/admin/testing` · `/admin/course-testing` · `/admin/python-course-testing` ·
`/admin/lms-core-testing` · `/admin/content` · `/admin/analytics`

---

## 19. Local development

### Prerequisites

- **Node ≥ 20.11** and **npm ≥ 10** (enforced via `engines`; `.nvmrc` is present)
- **PostgreSQL** (local or hosted)
- **Redis** — optional; `backend/docker-compose.yml` brings one up, but the app runs fine without it (see [§14](#14-background-jobs-queues--cron))

### One-time setup

```bash
git clone https://github.com/yuvaraj-dudukuru/LMS.git
cd LMS

# Backend
cd backend
npm install
cp .env.example .env          # then fill in DATABASE_URL and the JWT secrets
npx prisma generate
npx prisma migrate deploy     # applies migrations non-destructively
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Running

```bash
# Two terminals:
cd backend  && npm run dev    # tsx watch → http://localhost:3001 (Express + inline workers)
cd frontend && npm run dev    # Vite      → http://localhost:5173

# Or on Windows, both at once:
start.bat
```

Vite proxies `/api/*` to `http://127.0.0.1:3001`, so the SPA and API are same-origin during development and
cookies behave normally.

Optional Redis:

```bash
cd backend && docker compose up -d redis
```

### Useful scripts

| Where | Command | Effect |
|---|---|---|
| `backend` | `npm run dev` | Express + workers, watch mode |
| `backend` | `npm run dev:worker` | worker process only, watch mode |
| `backend` | `npm run build` | `prisma generate && tsc` |
| `backend` | `npm run start:web` | production web (workers disabled) |
| `backend` | `npm run start:worker` | production worker |
| `backend` | `npm test` | Vitest suite |
| `frontend` | `npm run dev` / `build` / `preview` | Vite |
| `frontend` | `npm test` | Vitest + Testing Library |

---

## 20. Environment variables

### Required (backend)

| Variable | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | 32+ chars — `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | 32+ chars, **different** from the access secret |
| `FRONTEND_URL` | used for CORS and for links inside emails |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | defaults to `3001` |

### Optional — each one enables a feature, and its absence degrades gracefully

| Variable | Enables | Without it |
|---|---|---|
| `REDIS_URL` | BullMQ connection | jobs run inline (see [§14](#14-background-jobs-queues--cron)) |
| `DISABLE_WORKERS` | set `true` on the web service | workers run in-process |
| `GOOGLE_AI_API_KEY` | Gemini project/capstone review | submissions become `NEEDS_REVIEW` for humans |
| `GROQ_API_KEY` | AI tutor chat | chat returns a "not configured" message |
| `RESEND_API_KEY` | email via Resend | falls back to SMTP |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | email via SMTP | no email delivery |
| `GITHUB_CLIENT_ID` / `_SECRET` / `_CALLBACK_URL` | GitHub OAuth | that provider hidden |
| `GOOGLE_CLIENT_ID` / `_SECRET` / `_CALLBACK_URL` | Google OAuth | that provider hidden |
| `LINKEDIN_CLIENT_ID` / `_SECRET` / `_CALLBACK_URL` | LinkedIn OAuth | that provider hidden |
| `CERTS_APP_URL` / `CERTS_BEARER_TOKEN` | external certificate service | certificates issued locally |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | token lifetimes | `15m` / `30d` |

`config.ts` logs OAuth configuration status and resolved callback URLs at boot — check that output first when
OAuth misbehaves.

---

## 21. Testing

### Backend — Vitest + supertest (`cd backend && npm test`)

| File | Covers |
|---|---|
| `auth.test.ts` | registration, login, token refresh, revocation |
| `adminAuth.test.ts` | role gating on admin routes |
| `progress.test.ts` | progress recording and unlock computation |
| `achievements.test.ts` | catalog evaluation and unlocking |
| `quizDistribution.test.ts` | quiz answer distribution sanity |
| `phase3.acceptance.test.ts` | end-to-end student pipeline |
| `phase3.adversarial.test.ts` | abuse, tampering, edge cases |
| `phase3.stress.test.ts` | concurrency and race conditions |

The deployment checklist treats **all 70 tests passing** as a release gate.

### Frontend — Vitest + Testing Library (`cd frontend && npm test`)

Tests are co-located: `api.test.ts`, `auth.test.tsx`, `auth.session.test.tsx`, `authClient.test.ts`,
`Shell.test.tsx`, `functional.test.tsx`, `components/admin/AdminRoute.test.tsx`,
`components/lesson/AILearnSection.test.tsx`, `utils/pythonRunnerInteractive.test.ts`.

---

## 22. Deployment

`DEPLOYMENT_CHECKLIST.md` is the authoritative runbook. Summary:

### Frontend

**GitHub Pages** via `.github/workflows/deploy.yml` — on push to `main` it installs, builds `frontend/`, copies
`dist/index.html` to `404.html` for SPA fallback, and publishes to the `gh-pages` branch with CNAME
`academy.fraylontech.com`.

**Vercel** is also supported — `frontend/vercel.json` rewrites everything except `/api/*` to `/index.html`, and
`https://lms05.vercel.app` is in the backend's CORS allowlist.

### Backend — Railway, two services

| | Service 1 — Web API | Service 2 — Worker |
|---|---|---|
| Build | `npm run build` | `npm run build` |
| Start | `npm run start:web` | `npm run start:worker` |
| Env | `DISABLE_WORKERS=true` | *(none)* |
| Health check | `/api/health`, 30 s timeout | n/a (non-HTTP) |
| Restart policy | `on_failure`, max 5 | `on_failure`, max 5 |

> **Never** use bare `npm start` on Railway. Add the Postgres and Redis plugins — Railway injects `DATABASE_URL`
> and `REDIS_URL` automatically. The worker process exits fatally if either is missing.

### Migrations

```bash
npx prisma migrate deploy      # always this in production — additive, non-destructive
```

Never run `prisma db push --accept-data-loss` against production; it can silently drop columns.
(`backend/start.sh` still contains a legacy `db push` path — prefer the Railway start commands above.)

### Post-deploy verification

```bash
curl https://your-api.railway.app/api/health
# → { "status": "ok" }

curl -H "Authorization: Bearer <admin_token>" https://your-api.railway.app/api/admin/health

curl https://your-api.railway.app/api/certifications/verify/NONEXISTENT
# → 404 { "valid": false }
```

### Rollback

Railway supports instant rollback to the previous deployment. Migrations are additive, so no DB rollback is
normally needed; to reverse one, write a new forward migration that undoes it.

---

## 23. Seeding & operational scripts

Run these with `railway run` against the target service so the production `DATABASE_URL` is used:

```bash
npx tsx scripts/migrate-lessons-to-db.ts   # courses, lessons, quizzes, projects (from frontend/public/data)
npx tsx src/seeds/seed_milestones.ts       # portfolio / certification project templates
npx tsx scripts/seed_projects.ts           # project catalog
npm run seed:assessments                   # assessment & quiz question bank
npm run seed:drag-drop                     # drag-and-drop exercises
npx tsx src/seeds/practiceExercises.ts     # AI-mentor practice exercise prompts
```

> ⚠️ `migrate-lessons-to-db.ts` **deletes and re-inserts** `Lesson`/`Quiz`/`CourseProject` rows per course. Safe
> for a fresh database; it will overwrite anything hand-edited in production.
>
> ⚠️ Never run `clear_projects.js` against production — it unconditionally deletes `project_submissions`.

Other utilities in `backend/scripts/`: `analyze-blocks.ts`, `generateQuizExplanations.ts`, `listUsers.ts`,
`shuffle_quizzes.js`, `check_distribution.js`, `removeExpectedOutput.ts`,
`cleanup_duplicate_achievement_notifications.ts`.

---

## 24. The certificate verification service (`certs/`)

An independent **Next.js 14** application providing tamper-resistant certificate verification for Fraylon
Technologies LLP at `verify.fraylontech.com`. It has its own README with a full decision log; the essentials:

- **Stack:** Next.js 14 App Router on Vercel, Supabase (Postgres) for storage, Upstash Redis for rate limiting
  (30 req/min — in-memory limiters don't work on serverless), Puppeteer for PDF rendering.
- **HMAC is strict.** The signed payload is *not* trimmed or lowercased, so any cosmetic edit to the recipient
  name or program in the database causes verification to fail. This produces a fourth UI state — **tampered** —
  distinct from **revoked**.
- **Privacy on failure.** Revoked certificates show only the date and reason; tampered ones show only the cert ID.
  Neither leaks the recipient name or program, so a forged certificate can't display its target's identity.
- **Certificate numbers** follow `FRY-<TYPE>-YYYY-NNNNN`, resolved by QR code.
- It uses **pnpm**, not npm.

The main LMS delegates to this service only when `CERTS_APP_URL` and `CERTS_BEARER_TOKEN` are set; otherwise it
issues certificates locally.

---

## 25. Known gaps & gotchas

Recorded honestly so nobody rediscovers them the hard way.

| # | Issue | Impact |
|---|---|---|
| 1 | **Queue producers are mocked** (`lib/queue.ts`) and jobs run inline via `setImmediate` monkey-patching | No retries, no persistence across restarts, no cross-process distribution. Setting `REDIS_URL` does not currently switch it to real BullMQ. See [§14](#14-background-jobs-queues--cron). |
| 2 | The deploy workflow step is titled *"Build frontend (static, no backend)"* | Historical — the app does call `/api`. GitHub Pages serves only the SPA; the API must be reachable at its deployed origin and listed in the CORS allowlist. |
| 3 | `services/gemini.ts` calls **Groq**, not Gemini | Naming artifact. Gemini lives in `aiReviewService.ts`. |
| 4 | Vite build emits chunks > 500 KB | Runtime performance is acceptable; code-splitting deferred. |
| 5 | Duplicate-submission guard is TOCTOU under extreme concurrency | Sequential flow is correct; a DB unique constraint would harden it. |
| 6 | `sqlite3` is still in backend `dependencies` | Unused — remove in the next dependency cleanup. |
| 7 | Repository root holds many one-off audit scripts, `.docx` reports, and archives | Historical working files, not part of the build. |
| 8 | `content/` duplicates `frontend/public/data/` | Legacy. Add content only to `frontend/public/data/`. |
| 9 | Admin router mount order in `app.ts` is load-bearing | `/api/admin/branding` must stay mounted *before* the blanket admin routers or it gets swallowed by their auth guard. |
| 10 | `backend/start.sh` still uses `prisma db push --accept-data-loss` | Don't use it for production; use the Railway start commands. |

---

## 26. Contributing

See `CONTRIBUTING.md` for the full agreement. The short version:

1. **Never push directly to `main`** — everything goes through a PR.
2. **Branch off `main`**, named `feat/`, `fix/`, `content/`, `chore/`, or `docs/`.
3. **One reviewer per PR.** CODEOWNERS auto-assigns.
4. **Never commit build artifacts** — `dist/`, `docs/`, `.vite/` are gitignored; CI builds them.
5. **Keep PRs small.** A 50-file PR is two PRs that should have been opened separately.
6. **Always read a file before editing it**, and don't reformat unrelated code in a feature PR.
7. **Never commit secrets or `.env` files.**
8. New utilities and features ship with tests.

### Adding a lecture

1. Branch: `content/<course>-lecture-<n>`.
2. Create `frontend/public/data/<course>/lecture_N/lesson.json` (copy a neighbouring lecture as a template).
3. Register it in `frontend/public/data/<course>/lectures.json`.
4. If lecture counts changed, update `COURSE_LECTURE_COUNTS` in `backend/src/routes/courses.ts` and
   `COURSE_PROBLEM_COUNTS` in `backend/src/services/certificationService.ts` — certification grading reads both.
5. `npm run dev` in `frontend/`, open the lecture, verify every block renders and section-completion tracking
   fires.
6. Commit, push, open the PR.

### Adding an achievement

Add one entry to `backend/src/achievements/catalog.ts`. It propagates everywhere automatically — unless it needs
a new icon key, which is one line in `frontend/src/lib/achievementIcons.ts`. Never rename or remove an existing id.

---

*GyanSetu LMS v3.0.0*
