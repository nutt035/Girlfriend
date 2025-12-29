'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import TagChips from '@/components/TagChips';
import { useAppStore } from '@/lib/store';
import { formatDate, getMoodEmoji } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, Calendar, Heart } from 'lucide-react';

export default function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { universeData, selectedYear, deleteEntry } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const entry = yearData?.entries.find(e => e.id === id);

    if (!entry) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        ไม่พบบันทึก
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        บันทึกนี้อาจถูกลบไปแล้ว หรืออาจอยู่ในปีอื่น
                    </p>
                    <Link href="/journal">
                        <button className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium">
                            กลับไปหน้า Journal
                        </button>
                    </Link>
                </main>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm('ต้องการลบบันทึกนี้หรือไม่?')) {
            deleteEntry(selectedYear, id);
            router.push('/journal');
        }
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Back & Actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/journal">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">กลับ</span>
                        </motion.button>
                    </Link>

                    <div className="flex gap-2">
                        <Link href={`/journal/${id}/edit`}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            >
                                <Edit className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <motion.button
                            onClick={handleDelete}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        >
                            <Trash2 className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Entry Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PaperCard lined className="p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(entry.date, 'long')}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {entry.title}
                                </h1>
                            </div>

                            <div className="text-center">
                                <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Mood: {entry.mood}/10
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        {entry.tags.length > 0 && (
                            <div className="mb-6">
                                <TagChips tags={entry.tags} size="md" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {entry.content}
                            </p>
                        </div>

                        {/* Photos */}
                        {entry.photos.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-rose-500" />
                                    รูปภาพ
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {entry.photos.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
                                        >
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                📷 {photo}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </PaperCard>
                </motion.div>
            </main>
        </div>
    );
}
