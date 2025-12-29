'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import TagChips from '@/components/TagChips';
import SearchBar from '@/components/SearchBar';
import { useAppStore } from '@/lib/store';
import { filterEntries, getAllTags, formatDate, getMoodEmoji } from '@/lib/utils';
import { Plus, BookOpen, ArrowLeft, PenTool } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function JournalPage() {
    const { universeData, selectedYear, searchQuery, setSearchQuery, selectedTags, toggleTag } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const entries = yearData?.entries || [];

    const allTags = getAllTags(entries);
    const filteredEntries = filterEntries(entries, searchQuery, selectedTags);

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Back & Title */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                                Journal
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">บันทึกประจำวันของเรา</p>
                        </div>
                    </div>

                    <Link href="/journal/new">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">เพิ่มบันทึก</span>
                        </motion.button>
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="ค้นหาบันทึก..."
                    />

                    {allTags.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">กรองตาม tag:</p>
                            <TagChips
                                tags={allTags}
                                selectedTags={selectedTags}
                                onTagClick={toggleTag}
                            />
                        </div>
                    )}
                </div>

                {/* Entries List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredEntries.length === 0 ? (
                            <EmptyState
                                icon={PenTool}
                                title={searchQuery || selectedTags.length > 0 ? "ไม่พบผลลัพธ์" : "ยังไม่มีบันทึก"}
                                description={searchQuery || selectedTags.length > 0 ? "ลองค้นหาด้วยคำอื่นดูนะ" : "มาเริ่มบันทึกเรื่องราวดีๆ ของเรากันเถอะ"}
                                actionLabel={entries.length === 0 ? "เริ่มเขียนบันทึกแรก" : undefined}
                                actionHref={entries.length === 0 ? "/journal/new" : undefined}
                            />
                        ) : (
                            filteredEntries.map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/journal/${entry.id}`}>
                                        <PaperCard lined hoverable className="p-4 sm:p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Date */}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        {formatDate(entry.date, 'long')}
                                                    </p>

                                                    {/* Title */}
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
                                                        {entry.title}
                                                    </h3>

                                                    {/* Content preview */}
                                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-2 sm:mb-3">
                                                        {entry.content}
                                                    </p>

                                                    {/* Tags */}
                                                    {entry.tags.length > 0 && (
                                                        <TagChips tags={entry.tags} size="sm" />
                                                    )}
                                                </div>

                                                {/* Mood */}
                                                <div className="flex flex-col items-center flex-shrink-0">
                                                    <span className="text-2xl sm:text-3xl">{getMoodEmoji(entry.mood)}</span>
                                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{entry.mood}/10</span>
                                                </div>
                                            </div>

                                            {/* Photos indicator */}
                                            {entry.photos.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        📷 {entry.photos.length} รูปภาพ
                                                    </p>
                                                </div>
                                            )}
                                        </PaperCard>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
