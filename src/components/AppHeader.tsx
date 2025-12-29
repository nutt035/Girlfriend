'use client';

import Link from 'next/link';
import YearSwitcher from './YearSwitcher';
import ThemeToggle from './ThemeToggle';
import { useAppStore } from '@/lib/store';
import { useCloudSync } from '@/hooks/useCloudSync';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cloud, RefreshCw, AlertCircle } from 'lucide-react';

export default function AppHeader() {
    const { universeData } = useAppStore();
    const appName = universeData.meta.appName;

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-white/20"
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg"
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                            {appName}
                        </span>
                    </Link>

                    {/* Sync Status */}
                    <SyncIndicator />

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <YearSwitcher />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Year Switcher - Mobile */}
                <div className="sm:hidden mt-3 flex justify-center">
                    <YearSwitcher />
                </div>
            </div>
        </motion.header>
    );
}

function SyncIndicator() {
    const { shareId, isSyncing, lastSyncedAt, error } = useCloudSync();

    if (!shareId) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
            {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            ) : error ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            ) : (
                <Cloud className="w-3.5 h-3.5 text-green-500" />
            )}
            <div className="hidden md:block overflow-hidden">
                <p className="text-[10px] font-bold text-gray-500 leading-none">
                    {isSyncing ? 'SYNCING...' : error ? 'ERROR' : 'CLOUD SAVED'}
                </p>
                {lastSyncedAt && !error && !isSyncing && (
                    <p className="text-[8px] text-gray-400 mt-0.5">
                        {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
}
