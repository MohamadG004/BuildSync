'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, SkipForward, RotateCcw, Trophy, Flame, ChevronRight } from 'lucide-react';
import { GUESS_BUILD_THEMES, type GuessBuildTheme } from '@/lib/guessBuildThemes';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

// ── Letter reveal logic ──────────────────────────────────────────────────────

/** Returns a stable mask array for a given theme+difficulty using a seeded approach */
function buildMask(theme: string, difficulty: Difficulty, seed: number): boolean[] {
  const revealPct = difficulty === 'easy' ? 0.65 : difficulty === 'medium' ? 0.25 : 0;
  // Simple LCG seeded random for deterministic masks
  let state = seed;
  function rand() {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 4294967296;
  }
  return theme.split('').map(ch => {
    if (ch === ' ') return true; // spaces always visible (shows word count)
    return rand() < revealPct;
  });
}

// ── Theme display tile ────────────────────────────────────────────────────────

interface ThemeDisplayProps {
  theme: string;
  mask: boolean[];
  solved: boolean;
  wrong: boolean;
}

function ThemeDisplay({ theme, mask, solved, wrong }: ThemeDisplayProps) {
  const chars = theme.split('');
  // Scale tile size based on total non-space chars
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
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
      {chars.map((ch, i) => {
        if (ch === ' ') {
          return <div key={i} className="w-3" aria-hidden />;
        }
        const shown = mask[i] || solved;
        return (
          <div
            key={i}
            className={cn(
              'flex items-center justify-center rounded-lg border font-mono font-bold uppercase transition-all',
              tileSize,
              shown ? baseColor : blankColor
            )}
          >
            {shown ? ch : ''}
          </div>
        );
      })}
    </div>
  );
}

// ── Difficulty badge ──────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   pct: '60–70%', color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.25)' },
  medium: { label: 'Medium', pct: '20–30%', color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.25)' },
  hard:   { label: 'Hard',   pct: '0%',     color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)' },
};

// ── Pick a random theme (excluding current) ───────────────────────────────────

function pickTheme(exclude?: GuessBuildTheme): { theme: GuessBuildTheme; seed: number } {
  const pool = exclude
    ? GUESS_BUILD_THEMES.filter(t => t.theme !== exclude.theme)
    : GUESS_BUILD_THEMES;
  const theme = pool[Math.floor(Math.random() * pool.length)];
  const seed  = Math.floor(Math.random() * 999999);
  return { theme, seed };
}

// ── Check answer ──────────────────────────────────────────────────────────────

function isCorrect(guess: string, theme: GuessBuildTheme): boolean {
  const g = guess.trim().toLowerCase();
  if (g === theme.theme.toLowerCase()) return true;
  return (theme.aliases ?? []).some(a => a.toLowerCase() === g);
}

// ── Main component ─────────────────────────────────────────────────────────────

export function GuessBuildClient() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentTheme, setCurrentTheme] = useState<GuessBuildTheme | null>(null);
  const [seed, setSeed]                 = useState(0);
  const [mask, setMask]                 = useState<boolean[]>([]);
  const [guess, setGuess]               = useState('');
  const [status, setStatus]             = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore]               = useState(0);
  const [streak, setStreak]             = useState(0);
  const [skipped, setSkipped]           = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [showAnswer, setShowAnswer]     = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTheme = useCallback((exclude?: GuessBuildTheme, diff: Difficulty = difficulty) => {
    const { theme, seed: s } = pickTheme(exclude);
    setCurrentTheme(theme);
    setSeed(s);
    setMask(buildMask(theme.theme, diff, s));
    setGuess('');
    setStatus('idle');
    setShowAnswer(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    loadTheme();
  }, []);                                              // only on mount

  // When difficulty changes, rebuild mask for current theme
  useEffect(() => {
    if (currentTheme) {
      setMask(buildMask(currentTheme.theme, difficulty, seed));
    }
  }, [difficulty]);

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
      nextTimerRef.current = setTimeout(() => loadTheme(currentTheme), 900);
    } else {
      setStatus('wrong');
      setStreak(0);
      setGuess('');
    }
  }

  function handleSkip() {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    setSkipped(s => s + 1);
    setStreak(0);
    loadTheme(currentTheme);
  }

  function handleReveal() {
    setShowAnswer(true);
  }

  function handleReset() {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    setScore(0);
    setStreak(0);
    setSkipped(0);
    setTotalGuesses(0);
    loadTheme(undefined, difficulty);
  }

  function handleDifficulty(d: Difficulty) {
    setDifficulty(d);
    // mask rebuild is handled via useEffect
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Guess the Build
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Type the Build Battle theme before time runs out — just like the real game.
        </p>
      </motion.div>

      {/* Difficulty selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 flex items-center justify-center gap-2"
      >
        <span className="text-xs font-medium text-slate-400 mr-1">Difficulty:</span>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
          const cfg = DIFFICULTY_CONFIG[d];
          const active = difficulty === d;
          return (
            <button
              key={d}
              onClick={() => handleDifficulty(d)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all',
                active
                  ? 'text-white'
                  : 'text-slate-500 bg-white border-[var(--border)] hover:border-slate-300'
              )}
              style={active ? { background: cfg.color, borderColor: cfg.color, color: '#fff' } : {}}
            >
              {cfg.label}
              <span className="ml-1 opacity-70 font-normal">{cfg.pct}</span>
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

          {/* Theme length hint */}
          {currentTheme && (
            <p className="absolute top-4 left-4 text-xs text-slate-400 font-mono">
              {currentTheme.theme.split(' ').map(w => w.length).join(' + ')} letters
            </p>
          )}

          {/* Letter tiles */}
          {currentTheme ? (
            <ThemeDisplay
              theme={showAnswer ? currentTheme.theme : currentTheme.theme}
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
                <Check size={16} />
                Correct! Next theme loading…
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
                <X size={16} />
                Not quite — try again!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={guess}
              onChange={e => {
                setGuess(e.target.value);
                if (status === 'wrong') setStatus('idle');
              }}
              placeholder="Type your answer and press Enter…"
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
                  : 'border-[var(--border)] bg-[var(--surface-2)] focus:border-[var(--accent-border)] focus:bg-white focus:ring-[var(--accent-soft)]'
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
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-50"
              >
                Reveal answer
              </button>
            )}
            <button
              onClick={handleSkip}
              disabled={status === 'correct'}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
            >
              <SkipForward size={12} />
              Skip
            </button>
          </div>
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
            <span><strong className="text-slate-700">Easy</strong> — 60–70% of letters are revealed. Great for warming up.</span>
          </div>
          <div className="flex gap-2">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded text-white flex items-center justify-center text-[10px] font-bold"
              style={{ background: DIFFICULTY_CONFIG.medium.color }}
            >M</span>
            <span><strong className="text-slate-700">Medium</strong> — 20–30% revealed. Mimics the real game challenge.</span>
          </div>
          <div className="flex gap-2">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded text-white flex items-center justify-center text-[10px] font-bold"
              style={{ background: DIFFICULTY_CONFIG.hard.color }}
            >H</span>
            <span><strong className="text-slate-700">Hard</strong> — No letters revealed. Pure memory and instinct.</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Shortcuts count! Try typing <code className="rounded bg-slate-100 px-1 py-0.5">TV</code> for Television
          or <code className="rounded bg-slate-100 px-1 py-0.5">UFO</code> for Unidentified Flying Object.
          Answers are case-insensitive.
        </p>
      </motion.div>

      {/* Theme count info */}
      <p className="mt-4 text-center text-xs text-slate-300">
        {GUESS_BUILD_THEMES.length} themes available
      </p>
    </div>
  );
}