'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import TagChips from '@/components/TagChips';
import { useAppStore } from '@/lib/store';
import { getQuestProgress, checkBadgeUnlock } from '@/lib/utils';
import { ArrowLeft, Sword, Trophy, Star, CheckCircle2, Circle, PlayCircle, Filter } from 'lucide-react';
import { Quest } from '@/types';

type FilterStatus = 'all' | 'todo' | 'doing' | 'done';

const difficultyStars = (difficulty: number) => {
    return Array(5).fill(0).map((_, i) => (
        <Star
            key={i}
            className={`w-4 h-4 ${i < difficulty ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
    ));
};

const statusIcons: Record<Quest['status'], React.ReactNode> = {
    todo: <Circle className="w-5 h-5 text-gray-400" />,
    doing: <PlayCircle className="w-5 h-5 text-blue-500" />,
    done: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
};

const statusColors: Record<Quest['status'], string> = {
    todo: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    doing: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
    done: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700',
};

export default function QuestsPage() {
    const [filter, setFilter] = useState<FilterStatus>('all');
    const { universeData, selectedYear, updateQuestStatus } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const quests = yearData?.quests || [];

    const progress = yearData ? getQuestProgress(yearData) : { done: 0, total: 0, percentage: 0 };

    const filteredQuests = quests.filter(q => filter === 'all' || q.status === filter);

    // Check unlocked badges
    const unlockedBadges = universeData.badges.filter(badge => checkBadgeUnlock(badge, universeData));

    const handleStatusChange = (questId: string, newStatus: Quest['status']) => {
        updateQuestStatus(selectedYear, questId, newStatus);
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Sword className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                                Quest Log
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ภารกิจคู่รักของเรา</p>
                        </div>
                    </div>

                    <Link href="/quests/new">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg font-medium text-sm"
                        >
                            <span className="text-lg">+</span>
                            <span className="hidden sm:inline">เพิ่ม Quest</span>
                        </motion.button>
                    </Link>
                </div>

                {/* Progress Bar */}
                <PaperCard className="p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-800 dark:text-gray-100">
                            Quest Progress {selectedYear}
                        </span>
                        <span className="text-2xl font-bold text-emerald-500">
                            {progress.done}/{progress.total}
                        </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        ทำ Quest สำเร็จแล้ว {progress.percentage}%
                    </p>
                </PaperCard>

                {/* Achievements/Badges */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Achievements ({unlockedBadges.length}/{universeData.badges.length})
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {universeData.badges.map((badge) => {
                            const isUnlocked = checkBadgeUnlock(badge, universeData);

                            return (
                                <motion.div
                                    key={badge.id}
                                    whileHover={{ scale: 1.05 }}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl border-2
                    ${isUnlocked
                                            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-400'
                                            : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-50'
                                        }
                  `}
                                >
                                    <span className="text-2xl">{badge.icon}</span>
                                    <div>
                                        <p className={`font-medium ${isUnlocked ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {badge.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {badge.description}
                                        </p>
                                    </div>
                                    {isUnlocked && (
                                        <CheckCircle2 className="w-5 h-5 text-amber-500 ml-2" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'todo', 'doing', 'done'] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`
                px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                ${filter === status
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400'
                                }
              `}
                        >
                            {status === 'all' && 'ทั้งหมด'}
                            {status === 'todo' && '📋 Todo'}
                            {status === 'doing' && '🔄 Doing'}
                            {status === 'done' && '✅ Done'}
                        </button>
                    ))}
                </div>

                {/* Quest List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredQuests.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="text-6xl mb-4">⚔️</div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    ไม่มี Quest ในหมวดนี้
                                </p>
                            </motion.div>
                        ) : (
                            filteredQuests.map((quest, index) => (
                                <motion.div
                                    key={quest.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <PaperCard className={`p-5 border-2 ${statusColors[quest.status]}`}>
                                        <div className="flex items-start gap-4">
                                            {/* Status Icon */}
                                            <div className="pt-1">
                                                {statusIcons[quest.status]}
                                            </div>

                                            {/* Quest Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className={`text-lg font-bold ${quest.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                                                        {quest.title}
                                                    </h3>

                                                    {/* Difficulty */}
                                                    <div className="flex shrink-0">
                                                        {difficultyStars(quest.difficulty)}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                    {quest.description}
                                                </p>

                                                {/* Tags */}
                                                {quest.tags.length > 0 && (
                                                    <div className="mt-3">
                                                        <TagChips tags={quest.tags} size="sm" />
                                                    </div>
                                                )}

                                                {/* Reward */}
                                                {quest.reward && (
                                                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm">
                                                        🎁 {quest.reward}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {quest.status !== 'todo' && (
                                                        <button
                                                            onClick={() => handleStatusChange(quest.id, 'todo')}
                                                            className="px-3 py-1 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                        >
                                                            Todo
                                                        </button>
                                                    )}
                                                    {quest.status !== 'doing' && (
                                                        <button
                                                            onClick={() => handleStatusChange(quest.id, 'doing')}
                                                            className="px-3 py-1 rounded-lg text-sm bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-900"
                                                        >
                                                            Start
                                                        </button>
                                                    )}
                                                    {quest.status !== 'done' && (
                                                        <button
                                                            onClick={() => handleStatusChange(quest.id, 'done')}
                                                            className="px-3 py-1 rounded-lg text-sm bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-900"
                                                        >
                                                            Complete ✓
                                                        </button>
                                                    )}

                                                    <div className="flex-1" />

                                                    <Link href={`/quests/edit/${quest.id}`}>
                                                        <button className="px-3 py-1 rounded-lg text-sm bg-white/50 dark:bg-slate-800/50 text-gray-500 hover:text-blue-500 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                                            แก้ไข
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </PaperCard>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
