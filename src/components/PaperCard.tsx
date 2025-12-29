'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PaperCardProps {
    children: ReactNode;
    className?: string;
    lined?: boolean;
    onClick?: () => void;
    hoverable?: boolean;
}

export default function PaperCard({
    children,
    className = '',
    lined = false,
    onClick,
    hoverable = false
}: PaperCardProps) {
    return (
        <motion.div
            onClick={onClick}
            className={`
        relative rounded-xl overflow-hidden
        bg-gradient-to-br from-amber-50 to-orange-50
        dark:from-slate-800 dark:to-slate-900
        shadow-lg
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
            whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
            whileTap={hoverable ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Lined paper effect */}
            {lined && (
                <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #bbb 28px)',
                        backgroundPosition: '0 12px'
                    }}
                />
            )}

            {/* Red margin line */}
            {lined && (
                <div className="absolute left-8 top-0 bottom-0 w-px bg-rose-300/40 dark:bg-rose-500/20 pointer-events-none" />
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-xl border border-white/30 dark:border-white/10 pointer-events-none" />
        </motion.div>
    );
}
