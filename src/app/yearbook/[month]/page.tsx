'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import TagChips from '@/components/TagChips';
import { useAppStore } from '@/lib/store';
import { getMonthName, formatDate, getMoodEmoji } from '@/lib/utils';
import { ArrowLeft, Calendar, BookOpen, Heart, Camera } from 'lucide-react';

export default function YearbookMonthPage({ params }: { params: Promise<{ month: string }> }) {
    const { month: monthStr } = use(params);
    const month = parseInt(monthStr);
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];

    const monthEntries = yearData?.entries.filter(e => {
        const entryMonth = new Date(e.date).getMonth() + 1;
        return entryMonth === month;
    }) || [];

    const monthMoments = yearData?.moments.filter(m => {
        const momentMonth = new Date(m.date).getMonth() + 1;
        return momentMonth === month;
    }) || [];

    const monthPhotos = yearData?.photos.filter(p => p.month === month) || [];

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/yearbook">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Calendar className="w-8 h-8 text-emerald-500" />
                            {getMonthName(month)} {selectedYear}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            เดือนที่ {month} ของปี {selectedYear}
                        </p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {/* Entries Section */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                            บันทึก ({monthEntries.length})
                        </h2>

                        {monthEntries.length > 0 ? (
                            <div className="space-y-4">
                                {monthEntries.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/journal/${entry.id}`}>
                                            <PaperCard hoverable className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(entry.date, 'long')}
                                                        </p>
                                                        <h3 className="font-bold text-gray-800 dark:text-gray-100">
                                                            {entry.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                                                            {entry.content}
                                                        </p>
                                                        {entry.tags.length > 0 && (
                                                            <div className="mt-2">
                                                                <TagChips tags={entry.tags} size="sm" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                                                </div>
                                            </PaperCard>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <PaperCard className="p-8 text-center">
                                <p className="text-gray-400 dark:text-gray-500">ไม่มีบันทึกในเดือนนี้</p>
                            </PaperCard>
                        )}
                    </section>

                    {/* Moments Section */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />
                            Moments ({monthMoments.length})
                        </h2>

                        {monthMoments.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {monthMoments.map((moment, index) => (
                                    <motion.div
                                        key={moment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/museum/${moment.id}`}>
                                            <PaperCard hoverable className="p-4 h-full">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(moment.date, 'long')}
                                                </p>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                                                    {moment.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                    {moment.description}
                                                </p>
                                                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                                                    {moment.category}
                                                </span>
                                            </PaperCard>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <PaperCard className="p-8 text-center">
                                <p className="text-gray-400 dark:text-gray-500">ไม่มี moment ในเดือนนี้</p>
                            </PaperCard>
                        )}
                    </section>

                    {/* Photos Section */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-blue-500" />
                            รูปภาพ ({monthPhotos.length})
                        </h2>

                        {monthPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {monthPhotos.map((photo, index) => (
                                    <motion.div
                                        key={photo.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <PaperCard className="overflow-hidden">
                                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <span className="text-4xl">📷</span>
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                                    {photo.caption}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(photo.date)}
                                                </p>
                                            </div>
                                        </PaperCard>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <PaperCard className="p-8 text-center">
                                <p className="text-gray-400 dark:text-gray-500">ไม่มีรูปภาพในเดือนนี้</p>
                            </PaperCard>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
