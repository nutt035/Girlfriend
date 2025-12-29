'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { getMonthlyHighlights, getMonthName } from '@/lib/utils';
import { ArrowLeft, Calendar, Star, Heart, Camera } from 'lucide-react';

export default function YearbookPage() {
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const monthlyHighlights = yearData ? getMonthlyHighlights(yearData, selectedYear) : [];
    const yearRecap = yearData?.yearRecap;

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
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
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                            Yearbook {selectedYear}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ปฏิทินความทรงจำของเรา</p>
                    </div>
                </div>

                {/* 12 Month Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 mb-8 sm:mb-12">
                    {monthlyHighlights.map((month, index) => {
                        const hasContent = month.entries.length > 0 || month.moments.length > 0 || month.photos.length > 0;

                        return (
                            <motion.div
                                key={month.month}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/yearbook/${month.month}`}>
                                    <PaperCard
                                        hoverable
                                        className={`p-2 sm:p-4 h-full ${!hasContent ? 'opacity-60' : ''}`}
                                    >
                                        <div className="text-center mb-1 sm:mb-3">
                                            <span className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                                {month.month}
                                            </span>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                {getMonthName(month.month)}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                            {month.entries.length > 0 && (
                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                    <Star className="w-3 h-3" />
                                                    {month.entries.length}
                                                </span>
                                            )}
                                            {month.moments.length > 0 && (
                                                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                                    <Heart className="w-3 h-3" />
                                                    {month.moments.length}
                                                </span>
                                            )}
                                            {month.photos.length > 0 && (
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                    <Camera className="w-3 h-3" />
                                                    {month.photos.length}
                                                </span>
                                            )}
                                        </div>

                                        {!hasContent && (
                                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                ยังไม่มีข้อมูล
                                            </p>
                                        )}
                                    </PaperCard>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Year Recap Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-amber-500" />
                        Year Recap {selectedYear}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Lessons Learned */}
                        <PaperCard className="p-4 sm:p-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                📚 Lessons Learned
                            </h3>
                            {yearRecap?.lessonsLearned.length ? (
                                <ul className="space-y-2">
                                    {yearRecap.lessonsLearned.map((lesson, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-emerald-500">•</span>
                                            {lesson}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic">ยังไม่มีข้อมูล</p>
                            )}
                        </PaperCard>

                        {/* Best Moments */}
                        <PaperCard className="p-4 sm:p-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                ✨ Best Moments
                            </h3>
                            {yearRecap?.bestMoments.length ? (
                                <ul className="space-y-2">
                                    {yearRecap.bestMoments.map((moment, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-rose-500">♥</span>
                                            {moment}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic">ยังไม่มีข้อมูล</p>
                            )}
                        </PaperCard>

                        {/* Gratitude */}
                        <PaperCard className="p-4 sm:p-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                🙏 Gratitude
                            </h3>
                            {yearRecap?.gratitude.length ? (
                                <ul className="space-y-2">
                                    {yearRecap.gratitude.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-amber-500">★</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic">ยังไม่มีข้อมูล</p>
                            )}
                        </PaperCard>

                        {/* Next Year Intentions */}
                        <PaperCard className="p-4 sm:p-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                🎯 Next Year Intentions
                            </h3>
                            {yearRecap?.nextYearIntentions.length ? (
                                <ul className="space-y-2">
                                    {yearRecap.nextYearIntentions.map((intention, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-blue-500">→</span>
                                            {intention}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic">ยังไม่มีข้อมูล</p>
                            )}
                        </PaperCard>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
