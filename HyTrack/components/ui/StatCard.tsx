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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        'group rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:shadow-md',
        highlight && 'border-[var(--accent)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p
            className={cn(
              'mt-1.5 text-2xl font-semibold leading-none text-slate-900',
              highlight && 'text-[var(--accent)]'
            )}
          >
            {value}
          </p>

          {subValue && (
            <p className="mt-1 text-xs text-slate-500">{subValue}</p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
            <Icon size={16} style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Mini Stat ─── */
interface MiniStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MiniStat({
  label,
  value,
  color = 'var(--accent)',
}: MiniStatProps) {
  return (
    <div className="text-center">
      <p
        className="text-lg font-semibold leading-none"
        style={{ color }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}