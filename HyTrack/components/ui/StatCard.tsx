'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  iconColor?: string;
  highlight?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = 'var(--accent)',
  highlight = false,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'group rounded-2xl border bg-white p-4 transition-all hover:shadow-md',
        highlight
          ? 'border-[var(--accent-border)] shadow-[0_0_0_1px_var(--accent-soft)]'
          : 'border-[var(--border)] shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className={cn(
            'mt-2 text-2xl font-bold leading-none tracking-tight',
            highlight ? 'text-[var(--accent)]' : 'text-slate-900'
          )}>
            {value}
          </p>
          {subValue && (
            <p className="mt-1.5 text-xs text-slate-400">{subValue}</p>
          )}
        </div>

        {Icon && (
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${iconColor}14` }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Mini Stat (used in PlayerHeader) ─── */
interface MiniStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MiniStat({ label, value, color = 'var(--accent)' }: MiniStatProps) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold leading-none" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}