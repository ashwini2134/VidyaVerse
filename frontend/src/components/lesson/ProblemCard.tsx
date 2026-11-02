import { useState, useEffect } from 'react';
import type { CodingProblem } from '../../types/lesson';
import CodeEditor from './CodeEditor';
import { runPython, normalizeNumbers, stripPrompts } from '../../utils/pythonRunner';
import { authFetch } from '../../authClient';
import { useAuth } from '../../auth';
import BeforeYouStartCard from './BeforeYouStartCard';
import HowWeEvaluateCard from './HowWeEvaluateCard';

const DIFF_COLOR: Record<string, string> = {
  easy:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard:   'text-red-400 bg-red-500/10 border-red-500/20',
};

interface TestResult {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  diffLines?: DiffLine[];
}

interface DiffLine {
  line: number;
  expected: string;
  actual: string;
  match: boolean;
  explanation?: string;
}

function lineDiff(expected: string, actual: string): { diffLines: DiffLine[]; explanation: string } {
  const expLines = expected.split('\n');
  const actLines = actual.split('\n');
  const maxLen = Math.max(expLines.length, actLines.length);
  const diffLines: DiffLine[] = [];
  let firstMismatchLine = -1;

  for (let i = 0; i < maxLen; i++) {
    const e = expLines[i] ?? '';
    const a = actLines[i] ?? '';
    const match = normalizeNumbers(e) === normalizeNumbers(a);
    if (!match && firstMismatchLine < 0) firstMismatchLine = i;
    diffLines.push({ line: i + 1, expected: e, actual: a, match });
  }

  let explanation = 'Output must match exactly.';
  if (firstMismatchLine >= 0) {
    const e = diffLines[firstMismatchLine].expected;
    const a = diffLines[firstMismatchLine].actual;
    if (e.length !== a.length) {
      explanation = `Line ${firstMismatchLine + 1} has different lengths (expected ${e.length} chars, got ${a.length}).`;
    } else {
      for (let j = 0; j < Math.max(e.length, a.length); j++) {
        if (e[j] !== a[j]) {
          const expChar = e[j] ?? '(end)';
          const actChar = a[j] ?? '(end)';
          const desc: Record<string, string> = {
            ' ': 'space',
            ',': 'comma',
            '.': 'period',
            '!': 'exclamation mark',
            "'": 'single quote',
            '"': 'double quote',
            '\t': 'tab',
          };
          const expDesc = desc[expChar] ?? `"${expChar}"`;
          const actDesc = desc[actChar] ?? `"${actChar}"`;
          explanation = `Line ${firstMismatchLine + 1}, character ${j + 1}: expected ${expDesc} but found ${actDesc}.`;
          break;
        }
      }
    }
  }

  return { diffLines, explanation };
}

interface ProblemCardProps {
  problem: CodingProblem;
  index: number;
  completed?: boolean;
  onComplete?: (id: string) => void;
  onAttempt?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ProblemCard({ problem, index, completed, onComplete, onAttempt, isOpen, onOpenChange }: ProblemCardProps) {
  const { user } = useAuth();
  const watermarkText = user ? `${user.name} · ${user.email}` : '';
  const [localOpen, setLocalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : localOpen;
  const setOpen = (val: boolean) => {
    setLocalOpen(val);
    onOpenChange?.(val);
  };
  const [tab, setTab] = useState<'description' | 'hints'>('description');
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [allPassed, setAllPassed] = useState(completed ?? false);
  const [showCompletion, setShowCompletion] = useState(false);

  // "Before You Start" is expanded the first time a student ever sees a
  // problem, then collapsed by default afterward so it doesn't nag returning
  // users — remembered globally, not per-problem.
  const [seenBeforeYouStart] = useState(() => {
    const seen = localStorage.getItem('lms:seenBeforeYouStart') === '1';
    if (!seen) localStorage.setItem('lms:seenBeforeYouStart', '1');
    return seen;
  });

  // Run-only state (separate from submission)
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  // ── BharatCode AI diagnosis state ─────────────────────────────────────────
  const [diagnosis, setDiagnosis] = useState<{
    success: true; rootCause: string; conceptClue: string;
    guidingQuestion: string; isMockMode: boolean;
  } | null>(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  const [savedCode, setSavedCode] = useState<string | null>(null);
  const saveKey = `lms:problem:${problem.id}`;

  useEffect(() => {
    async function loadDraft() {
      try {
        const data = await authFetch<{ code?: string }>(`/drafts/${problem.id}?type=problem`);
        if (data && data.code) setSavedCode(data.code);
      } catch (err) {
        console.error('Failed to load problem draft', err);
      }
    }
    loadDraft();
  }, [problem.id]);

  useEffect(() => {
    if (completed) setAllPassed(true);
  }, [completed]);

  const handleSave = (code: string) => {
    setSavedCode(code);
    authFetch('/drafts', {
      method: 'POST',
      body: JSON.stringify({
        lectureId: problem.id,
        type: 'problem',
        code
      })
    })
    .then(() => {
      localStorage.removeItem(saveKey);
    })
    .catch(err => console.error('Failed to save problem draft', err));
  };

  // Run — just execute, show output, no test cases
  const handleRun = (code: string, output: string, error: string | null) => {
    onAttempt?.();
    setRunOutput(output);
    setRunError(error);
    setTestResults(null);
    handleSave(code);
  };

  // Submit — run test cases, show submission results, update progress
  const handleSubmit = (code: string, _output: string, _error: string | null) => {
    onAttempt?.();
    handleSave(code);
    if (allPassed) return;
    
    if (problem.type === 'reflection') {
      const words = code.trim().split(/\\s+/).filter(w => w.length > 0);
      if (words.length >= 20) {
        completeProblem();
      } else {
        setRunError(`Reflection needs more detail. Please write at least 20 words (currently ${words.length}).`);
        setRunOutput(null);
        setTestResults(null);
      }
      return;
    }

    if (problem.testCases.length === 0) {
      completeProblem();
      return;
    }
    setTestResults(null);
    setRunOutput(null);
    setRunError(null);
    // Reset BharatCode diagnosis on every new submission attempt
    setDiagnosis(null);
    setDiagnosisError(null);

    setTimeout(() => {
      const results: TestResult[] = [];
      for (const tc of problem.testCases) {
        const inputs = tc.input ? tc.input.split('\n') : [];
        const result = runPython(code, inputs);
        const actual = result.error ? result.error : result.output;
        const actualPrompts = result.prompts || [];

        let expectedPrompts: string[] = [];
        if (problem.solution) {
          try {
            const solResult = runPython(problem.solution, inputs);
            expectedPrompts = solResult.prompts || [];
          } catch (e) {}
        }
        if (expectedPrompts.length === 0) {
          expectedPrompts = actualPrompts;
        }

        const actualClean = result.error ? result.error : stripPrompts(actual, actualPrompts);
        const expectedClean = stripPrompts(tc.expectedOutput, expectedPrompts);

        let passed = false;
        let diffLines: DiffLine[] = [];
        let explanation = '';

        if (tc.matchType === 'regex') {
          try {
            const regex = new RegExp(tc.expectedOutput);
            passed = regex.test(actual.trim());
          } catch (e) {}
          if (!passed) explanation = "Output does not match the required pattern.";
        } else if (tc.matchType === 'any_lines') {
          const expectedLinesCount = tc.expectedOutput.trim().split('\\n').length;
          const actualLines = actualClean.trim().split('\\n').filter(l => l.trim().length > 0);
          passed = actualLines.length === expectedLinesCount;
          if (!passed) explanation = `Expected exactly ${expectedLinesCount} non-empty lines, but got ${actualLines.length}.`;
        } else {
          const diff = lineDiff(expectedClean, actualClean);
          diffLines = diff.diffLines;
          explanation = diff.explanation;
          passed = normalizeNumbers(actualClean.trim()) === normalizeNumbers(expectedClean.trim());
        }
        results.push({ label: tc.label, passed, expected: expectedClean, actual: actualClean, diffLines });
        // Store explanation on first failed test case
        if (!passed && results.filter(r => !r.passed).length === 1) {
          results[results.length - 1].diffLines = diffLines.map(d => ({ ...d, explanation: d.match ? undefined : explanation }));
        }
      }
      setTestResults(results);
      if (results.every(r => r.passed)) {
        completeProblem();
      }
    }, 100);
  };

  const completeProblem = () => {
    setAllPassed(true);
    setShowCompletion(true);
    onComplete?.(problem.id);
    setTimeout(() => setShowCompletion(false), 1500);
  };

  // ── BharatCode AI: request a Socratic hint after failed submission ─────────
  const handleDiagnose = async (currentCode?: string) => {
    if (!testResults || testResults.every(r => r.passed)) return;
    const codeToSend = currentCode ?? savedCode ?? problem.starterCode ?? '';
    setDiagnosisLoading(true);
    setDiagnosisError(null);
    setDiagnosis(null);
    try {
      const failing = testResults
        .filter(r => !r.passed)
        .map(r => ({ label: r.label, expected: r.expected, actual: r.actual }));
      const res = await authFetch<{
        success: boolean; rootCause?: string; conceptClue?: string;
        guidingQuestion?: string; isMockMode?: boolean; error?: string;
      }>('/practice-exercises/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: `problem:${problem.id}`,
          problemTitle: problem.title,
          problemDescription: problem.description ?? '',
          studentCode: codeToSend,
          failingTests: failing,
        }),
      });
      if (res?.success && res.rootCause) {
        setDiagnosis(res as any);
      } else {
        setDiagnosisError(res?.error ?? 'AI tutor could not generate a hint. Please try again.');
      }
    } catch (err: any) {
      setDiagnosisError('Could not reach the AI tutor. Check your connection and try again.');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const diffCls = DIFF_COLOR[problem.difficulty] ?? DIFF_COLOR.easy;
  const passedCount = testResults ? testResults.filter(r => r.passed).length : 0;
  const totalCount = problem.testCases.length;

  if (!open) {
    return (
      <div
        className={`rounded-2xl border transition-all duration-200 cursor-pointer group relative
          ${allPassed
            ? 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-[var(--bg-surface)]'
            : 'border-[var(--border-primary)] bg-[var(--bg-surface)] hover:border-blue-500/30 shadow-sm'}`}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold
            ${allPassed ? 'bg-emerald-600/20 text-emerald-500' : 'bg-blue-600/15 text-blue-500 group-hover:bg-blue-600/25'}`}>
            {allPassed ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors truncate">
              {problem.title}
            </p>
          </div>
          {allPassed ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Solved
            </span>
          ) : (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${diffCls}`}>
              {problem.difficulty}
            </span>
          )}
          <svg className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden relative shadow-sm ${allPassed ? 'border-emerald-500/25' : 'border-[var(--border-primary)]'}`}
    >
      {watermarkText && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div
            className="absolute flex flex-wrap content-start gap-x-10 gap-y-16 opacity-[0.035]"
            style={{ top: '-20%', left: '-20%', width: '140%', height: '160%', transform: 'rotate(-22deg)' }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} className="text-[10px] font-mono text-[#64748b] whitespace-nowrap">
                {watermarkText}
              </span>
            ))}
          </div>
        </div>
      )}
      {showCompletion && (
        <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-bounce">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-white">Problem Solved</p>
              <p className="text-sm text-slate-300 mt-1">Great job!</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${diffCls}`}>
            {problem.difficulty}
          </span>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{problem.title}</h3>
          {allPassed && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Solved
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-[var(--border-primary)] bg-slate-50">
        {(['description', 'hints'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-all ${
              tab === t ? 'text-blue-500 border-b-2 border-blue-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)]">
        {tab === 'description' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-5 border-r border-[var(--border-primary)] space-y-4">
              <BeforeYouStartCard points={problem.beforeYouStart} defaultCollapsed={seenBeforeYouStart} />

              <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{problem.description}</p>
              </div>

              <HowWeEvaluateCard points={problem.evaluationNotes} />

              {allPassed && (
                <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                  <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Similar Problems to Try (Optional)
                  </p>
                  <ul className="space-y-2">
                    <li className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition-colors border-b border-slate-700/50 pb-1.5 last:border-0 last:pb-0">
                      → {problem.title.replace('Basic ', 'Advanced ').replace('Simple ', 'Complex ')} Challenge
                    </li>
                    <li className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                      → {problem.title} using built-in functions
                    </li>
                  </ul>
                </div>
              )}

              {totalCount > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Test Cases ({totalCount})</p>
                  {problem.testCases.map((tc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-slate-700/50 flex items-center justify-center text-[9px] text-slate-300 font-bold">
                        {i + 1}
                      </span>
                      <span>{tc.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <CodeEditor
                key={problem.id}
                initialCode={savedCode ?? problem.starterCode}
                language="python"
                height="240px"
                showSaveButton
                showSubmitButton
                disableClipboard
                onSave={handleSave}
                onRun={handleRun}
                onSubmit={handleSubmit}
              />

              {/* Run output — shown only when Run is clicked (no test cases) */}
              {runOutput !== null && !testResults && (
                <div className="p-3 rounded-xl border border-slate-700/30 bg-slate-900/50">
                  <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-2">Console Output</p>
                  {runError ? (
                    <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">{runError}</pre>
                  ) : (
                    <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{runOutput}</pre>
                  )}
                </div>
              )}

              {/* Run error — shown separately when there's an error on Run */}
              {runError !== null && !testResults && runOutput === null && (
                <div className="p-3 rounded-xl border border-red-700/30 bg-red-900/10">
                  <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">Error</p>
                  <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">{runError}</pre>
                </div>
              )}

              {/* Submission results — shown only after Submit */}
              {testResults && (
                <div className="space-y-3">
                  {testResults.every(r => r.passed) ? (
                    <div className="p-3 rounded-xl border border-emerald-700/30 bg-emerald-900/15 text-center">
                      <p className="text-sm font-semibold text-emerald-400">All tests passed!</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-amber-700/30 bg-amber-900/15 text-center">
                      <p className="text-sm font-semibold text-amber-400">Passed: {passedCount}/{totalCount}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Submission Result</p>
                    {testResults.map((r, i) => (
                      <div key={i} className={`p-3 rounded-xl border text-xs ${
                        r.passed ? 'border-emerald-700/30 bg-emerald-900/10' : 'border-red-700/30 bg-red-900/10'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={r.passed ? 'text-emerald-400' : 'text-red-400'}>
                            {r.passed ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                          <span className="text-slate-300 font-medium">{r.label}</span>
                        </div>

                        {!r.passed && (
                          <div className="ml-5 space-y-2">
                            {/* Line-by-line diff */}
                            {r.diffLines && (
                              <div className="space-y-0.5 font-mono text-[10px]">
                                <div className="text-slate-300 mb-1 text-[9px] uppercase tracking-wider">Line-by-line comparison:</div>
                                {r.diffLines.filter(d => !d.match).length > 0 && (
                                  <>
                                    <div className="text-green-400">Expected Output:</div>
                                    {r.diffLines.map((d) => (
                                      <div key={d.line} className={`${d.match ? 'text-slate-300' : 'text-green-400 bg-green-900/10 px-1 -mx-1 rounded'}`}>
                                        {d.expected || ' '}
                                      </div>
                                    ))}
                                    <div className="text-red-400 mt-2">Actual Output:</div>
                                    {r.diffLines.map((d) => (
                                      <div key={d.line} className={`${d.match ? 'text-slate-300' : 'text-red-400 bg-red-900/10 px-1 -mx-1 rounded'}`}>
                                        {d.actual || ' '}
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}

                            {/* Explanation */}
                            {r.diffLines && r.diffLines.some(d => !d.match && d.explanation) && (
                              <div className="mt-2 p-2 rounded-lg bg-blue-900/20 border border-blue-700/30">
                                <p className="text-[10px] text-blue-400 font-medium">
                                  {r.diffLines.find(d => d.explanation)?.explanation ?? 'Output must match exactly.'}
                                </p>
                              </div>
                            )}

                            {/* Fallback raw display */}
                            {(!r.diffLines || r.diffLines.filter(d => !d.match).length === 0) && (
                              <div className="space-y-1 font-mono text-[10px]">
                                <div className="flex gap-2">
                                  <span className="text-slate-300 shrink-0">Expected:</span>
                                  <span className="text-emerald-400 whitespace-pre-wrap" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{r.expected || '(empty)'}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-slate-300 shrink-0">Actual:</span>
                                  <span className="text-red-400 whitespace-pre-wrap">{r.actual || '(empty)'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ── BharatCode AI Hint Panel ───────────────────────── */}
                  {!testResults.every(r => r.passed) && (
                    <div className="mt-2 space-y-2">
                      {/* Trigger button */}
                      {!diagnosisLoading && !diagnosis && (
                        <button
                          onClick={() => handleDiagnose(savedCode ?? undefined)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold transition-all duration-200 hover:border-violet-400/50 group"
                        >
                          <svg className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Ask BharatCode AI — Get a Hint
                        </button>
                      )}

                      {/* Loading */}
                      {diagnosisLoading && (
                        <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-violet-500/20 bg-violet-900/10">
                          <svg className="w-3.5 h-3.5 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span className="text-xs text-violet-300">BharatCode AI is analysing your code…</span>
                        </div>
                      )}

                      {/* Error */}
                      {diagnosisError && !diagnosisLoading && (
                        <div className="p-3 rounded-xl border border-red-700/30 bg-red-900/10 space-y-1.5">
                          <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">AI Tutor Unavailable</p>
                          <p className="text-xs text-red-300">{diagnosisError}</p>
                          <button onClick={() => handleDiagnose()} className="text-[10px] font-semibold text-violet-400 hover:text-violet-300 underline transition-colors">Try again</button>
                        </div>
                      )}

                      {/* Diagnosis result */}
                      {diagnosis && diagnosis.success && !diagnosisLoading && (
                        <div className="rounded-xl border border-violet-500/25 bg-violet-900/10 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-violet-500/20 bg-violet-900/20">
                            <div className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">BharatCode AI Diagnosis</span>
                              {diagnosis.isMockMode && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">DEMO</span>
                              )}
                            </div>
                            <button
                              onClick={() => { setDiagnosis(null); setDiagnosisError(null); }}
                              className="text-slate-400 hover:text-slate-200 transition-colors"
                              title="Dismiss"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">Root Cause</p>
                              <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.rootCause}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1">Concept Clue</p>
                              <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.conceptClue}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest mb-1">Guiding Question</p>
                              <p className="text-xs text-violet-200 leading-relaxed italic">{diagnosis.guidingQuestion}</p>
                            </div>
                            <button
                              onClick={() => handleDiagnose(savedCode ?? undefined)}
                              className="text-[10px] font-semibold text-violet-400 hover:text-violet-300 underline transition-colors"
                            >
                              Request another diagnosis
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* ── End BharatCode AI ───────────────────────────────── */}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <div className="rounded-xl border border-blue-700/30 bg-blue-900/10 p-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Hints</p>
              {problem.hints && problem.hints.length > 0 ? (
                <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                  {problem.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  Try breaking the problem into smaller steps. Think about what each line of code needs to do.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
