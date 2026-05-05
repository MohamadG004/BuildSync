'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, SkipForward, RotateCcw, ChevronRight, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { GUESS_BUILD_THEMES, type GuessBuildTheme } from '@/lib/guessBuildThemes';
import { cn } from '@/lib/utils';

type Difficulty    = 'easy' | 'medium' | 'hard';
type LengthFilter  = 'any' | 'short' | 'medium-len' | 'long';
type RoundResult   = 'correct' | 'skipped' | 'revealed';

interface HistoryEntry {
  theme:   GuessBuildTheme;
  result:  RoundResult;
  guess?:  string;
}

// ── Letter reveal logic ──────────────────────────────────────────────────────

function buildMask(theme: string, difficulty: Difficulty, seed: number): boolean[] {
  const revealPct =
    difficulty === 'easy'   ? 0.65 :
    difficulty === 'medium' ? 0.25 :
    0;

  const chars = theme.split('');
  const letterIndices = chars.reduce<number[]>((acc, ch, i) => {
    if (ch !== ' ') acc.push(i);
    return acc;
  }, []);

  const revealCount = Math.round(letterIndices.length * revealPct);

  let state = seed;
  function rand() {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 4294967296;
  }
  const shuffled = [...letterIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const revealSet = new Set(shuffled.slice(0, revealCount));
  return chars.map((ch, i) => ch === ' ' ? true : revealSet.has(i));
}

// ── Theme display tile ────────────────────────────────────────────────────────

interface ThemeDisplayProps {
  theme:  string;
  mask:   boolean[];
  solved: boolean;
  wrong:  boolean;
}

function ThemeDisplay({ theme, mask, solved, wrong }: ThemeDisplayProps) {
  const chars = theme.split('');

  const nonSpaceCount = chars.filter(c => c !== ' ').length;
  const tileSize =
    nonSpaceCount <= 4  ? 'w-12 h-14 text-2xl'  :
    nonSpaceCount <= 7  ? 'w-10 h-12 text-xl'   :
    nonSpaceCount <= 12 ? 'w-9  h-11 text-lg'   :
    nonSpaceCount <= 18 ? 'w-8  h-10 text-base' :
    nonSpaceCount <= 25 ? 'w-7  h-9  text-sm'   :
                          'w-6  h-8  text-xs';

  const baseColor = solved
    ? 'border-[var(--green)] bg-[rgba(22,163,74,0.08)] text-[var(--green)]'
    : wrong
    ? 'border-red-300 bg-red-50 text-red-500'
    : 'border-[var(--border-strong)] bg-white text-slate-800';

  const blankColor = solved
    ? 'border-[var(--green)] bg-[rgba(22,163,74,0.08)]'
    : wrong
    ? 'border-red-300 bg-red-50'
    : 'border-[var(--border-strong)] bg-[var(--surface-2)]';

  return (
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 items-center">
      {chars.map((ch, i) => {
        if (ch === ' ') return <div key={i} className="w-3" aria-hidden />;
        const shown = mask[i] || solved;
        return (
          <div
            key={i}
            className={cn(
              'flex items-center justify-center rounded-lg border font-mono font-bold uppercase transition-all',
              tileSize,
              shown ? baseColor : blankColor,
            )}
          >
            {shown ? ch : ''}
          </div>
        );
      })}
    </div>
  );
}

// ── Config objects ────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy', color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.25)' },
  medium: { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.25)' },
  hard:   { label: 'Hard',  color: '#dc2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)' },
};

const LENGTH_CONFIG: Record<LengthFilter, { label: string; min: number; max: number }> = {
  any:          { label: 'Any', min: 0,  max: Infinity },
  short:        { label: '3–5', min: 3,  max: 5 },
  'medium-len': { label: '6–8', min: 6,  max: 8 },
  long:         { label: '9+',  min: 9,  max: Infinity },
};

const RESULT_CONFIG: Record<RoundResult, { label: string; color: string; bg: string; border: string }> = {
  correct:  { label: '✓', color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.3)' },
  skipped:  { label: '→', color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.3)' },
  revealed: { label: '👁', color: '#d97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.3)' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function letterCount(theme: string) {
  return theme.replace(/ /g, '').length;
}

function pickTheme(
  exclude?: GuessBuildTheme,
  lengthFilter: LengthFilter = 'any',
): { theme: GuessBuildTheme; seed: number } {
  const { min, max } = LENGTH_CONFIG[lengthFilter];

  let pool = GUESS_BUILD_THEMES.filter((t: GuessBuildTheme) => {
    if (exclude && t.theme === exclude.theme) return false;
    const c = letterCount(t.theme);
    return c >= min && c <= max;
  });

  if (pool.length === 0) {
    pool = GUESS_BUILD_THEMES.filter((t: GuessBuildTheme) => {
      const c = letterCount(t.theme);
      return c >= min && c <= max;
    });
  }
  if (pool.length === 0) pool = GUESS_BUILD_THEMES;

  const theme = pool[Math.floor(Math.random() * pool.length)];
  const seed  = Math.floor(Math.random() * 999999);
  return { theme, seed };
}

function isCorrect(guess: string, theme: GuessBuildTheme): boolean {
  const g = guess.trim().toLowerCase();

  const matches = (answer: string) => {
    const a = answer.toLowerCase();
    if (g === a) return true;
    if (a.includes(' ') && g === a.replace(/\s+/g, '')) return true;
    return false;
  };

  if (matches(theme.theme)) return true;
  return (theme.aliases ?? []).some((a: string) => matches(a));
}

// ── History panel ─────────────────────────────────────────────────────────────

function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 rounded-xl border border-[var(--border)] bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          Past themes
          <span className="rounded-full bg-slate-100 text-slate-500 text-xs font-normal px-2 py-0.5">
            {history.length}
          </span>
        </span>
        {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)] divide-y divide-[var(--border)] max-h-72 overflow-y-auto">
              {[...history].reverse().map((entry, i) => {
                const cfg = RESULT_CONFIG[entry.result];
                return (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    {/* Result badge */}
                    <span
                      className="mt-0.5 shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border"
                      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                    >
                      {cfg.label}
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Theme name */}
                      <p className="font-mono font-semibold text-sm text-slate-800 uppercase tracking-wide">
                        {entry.theme.theme}
                      </p>

                      {/* Aliases */}
                      {entry.theme.aliases && entry.theme.aliases.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {entry.theme.aliases.map(alias => (
                            <span
                              key={alias}
                              className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500"
                            >
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* What the player guessed */}
                      {entry.result === 'correct' && (
                        <p className="mt-0.5 text-xs text-slate-400">Correct</p>
                      )}
                      {entry.result === 'skipped' && (
                        <p className="mt-0.5 text-xs text-slate-400">Skipped</p>
                      )}
                      {entry.result === 'revealed' && (
                        <p className="mt-0.5 text-xs text-amber-500">Auto Revealed</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function GuessBuildClient() {
  const [difficulty,    setDifficulty]    = useState<Difficulty>('medium');
  const [lengthFilter,  setLengthFilter]  = useState<LengthFilter>('any');
  const [currentTheme,  setCurrentTheme]  = useState<GuessBuildTheme | null>(null);
  const [seed,          setSeed]          = useState(0);
  const [mask,          setMask]          = useState<boolean[]>([]);
  const [guess,         setGuess]         = useState('');
  const [status,        setStatus]        = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score,         setScore]         = useState(0);
  const [streak,        setStreak]        = useState(0);
  const [skipped,       setSkipped]       = useState(0);
  const [totalGuesses,  setTotalGuesses]  = useState(0);
  const [showAnswer,    setShowAnswer]    = useState(false);
  const [history,       setHistory]       = useState<HistoryEntry[]>([]);

  const inputRef     = useRef<HTMLInputElement>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTheme = useCallback(
    (
      exclude?: GuessBuildTheme | null,
      diff: Difficulty = difficulty,
      lenFilter: LengthFilter = lengthFilter,
    ) => {
      const { theme, seed: s } = pickTheme(exclude ?? undefined, lenFilter);
      setCurrentTheme(theme);
      setSeed(s);
      setMask(buildMask(theme.theme, diff, s));
      setGuess('');
      setStatus('idle');
      setShowAnswer(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [difficulty, lengthFilter],
  );

  // Initial load
  useEffect(() => { loadTheme(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild mask when difficulty changes (keep same theme)
  useEffect(() => {
    if (currentTheme) {
      setMask(buildMask(currentTheme.theme, difficulty, seed));
    }
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  function pushHistory(entry: HistoryEntry) {
    setHistory(h => [...h, entry]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentTheme || status !== 'idle') return;
    const trimmed = guess.trim();
    if (!trimmed) return;

    setTotalGuesses(t => t + 1);

    if (isCorrect(trimmed, currentTheme)) {
      setStatus('correct');
      setScore(s => s + 1);
      setStreak(st => st + 1);
      pushHistory({ theme: currentTheme, result: 'correct', guess: trimmed });
      nextTimerRef.current = setTimeout(() => loadTheme(currentTheme), 400);
    } else {
      setStatus('wrong');
      setStreak(0);
      setGuess('');
    }
  }

  function handleSkip() {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    if (currentTheme) pushHistory({ theme: currentTheme, result: 'skipped' });
    setSkipped(s => s + 1);
    setStreak(0);
    loadTheme(currentTheme);
  }

  function handleReveal() { setShowAnswer(true); }

  // Tab key: reveal answer, autofill the input, and mark as revealed in history
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Tab') return;
    if (!currentTheme || status !== 'idle') return;
    e.preventDefault();

    setShowAnswer(true);
    setGuess(currentTheme.theme);
    // Mark as revealed so the player knows; they still need to press Guess
    // (or they can skip). We flag the entry only once they move on.
    // Store a ref so skip/load can record it.
    pendingRevealRef.current = true;
  }

  // Track whether the current round was revealed via Tab
  const pendingRevealRef = useRef(false);

  // Reset the reveal flag whenever a new theme loads
  useEffect(() => {
    pendingRevealRef.current = false;
  }, [currentTheme]);

  function handleReset() {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    setScore(0);
    setStreak(0);
    setSkipped(0);
    setTotalGuesses(0);
    setHistory([]);
    loadTheme(undefined, difficulty, lengthFilter);
  }

  function handleDifficulty(d: Difficulty) {
    setDifficulty(d);
  }

  function handleLengthFilter(lf: LengthFilter) {
    setLengthFilter(lf);
    loadTheme(undefined, difficulty, lf);
  }

  // Override submit to record 'revealed' result when the answer was tabbed in
  function handleSubmitWrapped(e: React.FormEvent) {
    e.preventDefault();
    if (!currentTheme || status !== 'idle') return;
    const trimmed = guess.trim();
    if (!trimmed) return;

    setTotalGuesses(t => t + 1);

    if (isCorrect(trimmed, currentTheme)) {
      setStatus('correct');
      setScore(s => s + 1);
      if (!pendingRevealRef.current) setStreak(st => st + 1);
      else setStreak(0);
      pushHistory({
        theme: currentTheme,
        result: pendingRevealRef.current ? 'revealed' : 'correct',
        guess: trimmed,
      });
      nextTimerRef.current = setTimeout(() => loadTheme(currentTheme), 400);
    } else {
      setStatus('wrong');
      setStreak(0);
      setGuess('');
    }
  }

  // Also record 'revealed' on skip if tab was pressed
  function handleSkipWrapped() {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    if (currentTheme) {
      pushHistory({
        theme: currentTheme,
        result: pendingRevealRef.current ? 'revealed' : 'skipped',
      });
    }
    setSkipped(s => s + 1);
    setStreak(0);
    loadTheme(currentTheme);
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  const { min, max } = LENGTH_CONFIG[lengthFilter];
  const filteredCount = lengthFilter === 'any'
    ? GUESS_BUILD_THEMES.length
    : GUESS_BUILD_THEMES.filter(t => { const c = letterCount(t.theme); return c >= min && c <= max; }).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Guess the Build
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Type the Guess The Build theme - Just like the real game!
        </p>
      </motion.div>

      {/* Difficulty selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-3 flex items-center justify-center gap-2"
      >
        <span className="text-xs font-medium text-slate-400 mr-1">
          Difficulty:
        </span>

        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
          const cfg = DIFFICULTY_CONFIG[d];
          const active = difficulty === d;

          return (
            <button
              key={d}
              onClick={() => handleDifficulty(d)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all flex items-center justify-center text-center leading-none',
                active
                  ? 'text-white'
                  : 'text-slate-500 bg-white border-[var(--border)] hover:border-slate-300',
              )}
              style={
                active
                  ? {
                      background: cfg.color,
                      borderColor: cfg.color,
                      color: '#fff',
                    }
                  : {}
              }
            >
              {cfg.label}
            </button>
          );
        })}
      </motion.div>

      {/* Word-length filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-6 flex items-center justify-center gap-2"
      >
        <span className="text-xs font-medium text-slate-400 mr-1">Letters:</span>
        {(['any', 'short', 'medium-len', 'long'] as LengthFilter[]).map(lf => {
          const active = lengthFilter === lf;
          return (
            <button
              key={lf}
              onClick={() => handleLengthFilter(lf)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all',
                active
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'text-slate-500 bg-white border-[var(--border)] hover:border-slate-300',
              )}
            >
              {LENGTH_CONFIG[lf].label}
            </button>
          );
        })}
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex items-center justify-center gap-4 text-center"
      >
        {[
          { label: 'Score',   value: score,        color: 'var(--accent)' },
          { label: 'Streak',  value: streak,       color: '#f97316', icon: streak >= 3 ? '🔥' : undefined },
          { label: 'Skipped', value: skipped,      color: 'var(--text-muted)' },
          { label: 'Guesses', value: totalGuesses, color: 'var(--text-muted)' },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="font-mono text-xl font-bold" style={{ color: stat.color }}>
              {stat.icon}{stat.value}
            </span>
            <span className="text-xs text-slate-400">{stat.label}</span>
          </div>
        ))}
        <button
          onClick={handleReset}
          className="ml-2 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 border border-[var(--border)] hover:bg-slate-50 hover:text-slate-600 transition-colors"
          title="Reset stats"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </motion.div>

      {/* Main game card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-[var(--border)] bg-white shadow-sm"
      >
        {/* Theme display area */}
        <div className="relative min-h-[180px] flex flex-col items-center justify-center px-6 py-10 border-b border-[var(--border)]">

          {/* Difficulty badge */}
          <div
            className="absolute top-4 right-4 rounded-lg px-2.5 py-1 text-xs font-semibold border"
            style={{ color: config.color, background: config.bg, borderColor: config.border }}
          >
            {config.label}
          </div>

          {/* Theme letter-count hint */}
          {currentTheme && (
            <p className="absolute top-4 left-4 text-xs text-slate-400 font-mono">
              {currentTheme.theme.length} characters
            </p>
          )}

          {/* Letter tiles */}
          {currentTheme ? (
            <ThemeDisplay
              theme={currentTheme.theme}
              mask={showAnswer ? currentTheme.theme.split('').map(() => true) : mask}
              solved={status === 'correct'}
              wrong={status === 'wrong'}
            />
          ) : (
            <div className="h-14 w-48 rounded-xl bg-[var(--surface-2)] animate-pulse" />
          )}

          {/* Status message */}
          <AnimatePresence mode="wait">
            {status === 'correct' && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--green)]"
              >
                Correct!
              </motion.div>
            )}
            {status === 'wrong' && (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-500"
              >
                Not quite - Try again!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmitWrapped} className="flex gap-2">
            <input
              ref={inputRef}
              value={guess}
              onChange={e => {
                setGuess(e.target.value);
                if (status === 'wrong') setStatus('idle');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type Your Answer Here&hellip;"
              disabled={status === 'correct'}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={cn(
                'flex-1 rounded-xl border py-3 px-4 text-sm font-mono text-slate-900 outline-none transition-all placeholder:text-slate-400',
                'focus:ring-2',
                status === 'wrong'
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                  : status === 'correct'
                  ? 'border-[var(--green)] bg-[rgba(22,163,74,0.05)]'
                  : pendingRevealRef.current
                  ? 'border-amber-300 bg-amber-50 focus:border-amber-400 focus:ring-amber-100'
                  : 'border-[var(--border)] bg-[var(--surface-2)] focus:border-[var(--accent-border)] focus:bg-white focus:ring-[var(--accent-soft)]',
              )}
            />
            <button
              type="submit"
              disabled={status === 'correct' || !guess.trim()}
              className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dim)] disabled:opacity-40 active:scale-95 flex items-center gap-1.5"
            >
              <ChevronRight size={15} />
              Guess
            </button>
          </form>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2 justify-end">
            {!showAnswer && status !== 'correct' && (
              <button
                onClick={handleReveal}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-50"
              >
                <Eye size={11} />
                Reveal answer
              </button>
            )}
            <button
              onClick={handleSkipWrapped}
              disabled={status === 'correct'}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
            >
              <SkipForward size={12} />
              Skip
            </button>
          </div>

          {/* Tab hint */}
          {!showAnswer && status === 'idle' && (
            <p className="mt-2 text-right text-[10px] text-slate-300 select-none">
              Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px] text-slate-400 mr-0.5">Tab</kbd> to reveal &amp; autofill
            </p>
          )}

          {/* Aliases shown after reveal */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                {currentTheme?.aliases && currentTheme.aliases.length > 0 ? (
                  <>
                    <p className="text-xs text-slate-400 mb-1.5">Also accepted:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentTheme.aliases.map((alias) => (
                        <span
                          key={alias}
                          className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">No shortcuts for this one - exact answer only.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* How to play */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5"
      >
        <h2 className="mb-3 text-sm font-semibold text-slate-900">How to play</h2>
        <div className="grid gap-2 sm:grid-cols-3 text-xs text-slate-500">
          <div className="flex gap-2">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded text-white flex items-center justify-center text-[10px] font-bold"
              style={{ background: DIFFICULTY_CONFIG.easy.color }}
            >E</span>
            <span><strong className="text-slate-700">Easy</strong> - 65% of letters revealed. Great for warming up.</span>
          </div>
          <div className="flex gap-2">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded text-white flex items-center justify-center text-[10px] font-bold"
              style={{ background: DIFFICULTY_CONFIG.medium.color }}
            >M</span>
            <span><strong className="text-slate-700">Medium</strong> - 25% of letters revealed. Simulates a real in-game situation.</span>
          </div>
          <div className="flex gap-2">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded text-white flex items-center justify-center text-[10px] font-bold"
              style={{ background: DIFFICULTY_CONFIG.hard.color }}
            >H</span>
            <span><strong className="text-slate-700">Hard</strong> - no letters revealed. Pure memory and instinct.</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Gaps between tiles mark word breaks.
          Shortcuts count!
          Answers are case-insensitive.
          Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">Tab</kbd> in the input to reveal and autofill the answer.
        </p>
      </motion.div>

      {/* History panel */}
      <HistoryPanel history={history} />

      {/* Theme count info */}
      <p className="mt-4 text-center text-xs text-slate-300">
        {filteredCount} {lengthFilter !== 'any' ? 'matching' : ''} theme{filteredCount !== 1 ? 's' : ''} available
        {lengthFilter !== 'any' && <span className="ml-1">(of {GUESS_BUILD_THEMES.length} total)</span>}
      </p>
    </div>
  );
}