'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, MessageCircle, Calendar, ChevronRight, Trash2, Edit2, Ghost } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function ChatPage() {
    const { universeData, selectedYear, deleteChatEpisode } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const episodes = yearData?.chatEpisodes || [];

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
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
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <MessageCircle className="w-8 h-8 text-pink-500" />
                                Chatlog
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">บทสนทนาน่ารักของเรา</p>
                        </div>
                    </div>

                    <Link href="/chat/add">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg font-medium"
                        >
                            <span>+</span>
                            <span>เพิ่มแชท</span>
                        </motion.button>
                    </Link>
                </div>

                {/* Episodes List */}
                <div className="space-y-4">
                    {episodes.length === 0 ? (
                        <EmptyState
                            icon={Ghost}
                            title="ยังไม่มีบทสนทนา"
                            description="บันทึกบทสนทนาน่ารักๆ ของเราไว้ที่นี่นะ"
                            actionLabel="เพิ่มแชทแรก"
                            actionHref="/chat/add"
                        />
                    ) : (
                        episodes.map((episode, index) => (
                            <motion.div
                                key={episode.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                <Link href={`/chat/${episode.id}`} className="block">
                                    <PaperCard hoverable className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                {/* Episode Icon */}
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                                                    <MessageCircle className="w-6 h-6" />
                                                </div>

                                                {/* Episode Info */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                        {episode.title}
                                                    </h3>

                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(episode.date, 'long')}</span>
                                                    </div>

                                                    {episode.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                            {episode.description}
                                                        </p>
                                                    )}

                                                    {/* Message preview */}
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                                            {episode.messages.length} ข้อความ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </PaperCard>
                                </Link>

                                {/* Action Buttons - Absolute Positioned */}
                                <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Link href={`/chat/edit/${episode.id}`}>
                                        <button className="p-2 rounded-full bg-white dark:bg-slate-800 text-pink-500 shadow-md">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirm('ลบแชทตอนเอกพจน์นี้ใช่ไหม?')) {
                                                deleteChatEpisode(selectedYear, episode.id);
                                            }
                                        }}
                                        className="p-2 rounded-full bg-white dark:bg-slate-800 text-red-500 shadow-md"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
