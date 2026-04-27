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
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = 'var(--cyan)',
  highlight = false,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'glass-card group relative overflow-hidden rounded-xl p-4 transition-all duration-200',
        highlight && 'neon-border',
        className
      )}
    >
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${iconColor}08 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500 truncate">
            {label}
          </p>
          <p
            className={cn(
              'mt-1.5 font-mono text-2xl font-bold leading-none',
              highlight ? 'neon-cyan' : 'text-white'
            )}
            style={highlight ? { color: iconColor } : {}}
          >
            {value}
          </p>
          {subValue && (
            <p className="mt-1 font-mono text-xs text-gray-500">{subValue}</p>
          )}
        </div>

        {Icon && (
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}25`,
            }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Mini Stat (compact version) ─── */
interface MiniStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MiniStat({ label, value, color = 'white' }: MiniStatProps) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg font-bold leading-none" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-600">{label}</p>
    </div>
  );
}
