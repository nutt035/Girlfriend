'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 text-pink-400">
                <Icon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">{description}</p>

            {actionHref && actionLabel && (
                <Link href={actionHref}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-pink-100 rounded-2xl text-pink-500 font-bold shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Plus className="w-5 h-5" />
                        {actionLabel}
                    </motion.button>
                </Link>
            )}
        </motion.div>
    );
}
