'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Sword, Star, Check, Trash2 } from 'lucide-react';
import { Quest } from '@/types';

export default function EditQuestPage() {
    const router = useRouter();
    const params = useParams();
    const questId = params.id as string;

    const { selectedYear, universeData, updateQuest, deleteQuest } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const quest = yearData?.quests.find(q => q.id === questId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [reward, setReward] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (quest) {
            setTitle(quest.title);
            setDescription(quest.description);
            setDifficulty(quest.difficulty);
            setReward(quest.reward || '');
            setTags(quest.tags.join(', '));
        }
    }, [quest]);

    if (!quest) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <p className="text-gray-500">ไม่พบ Quest ที่ต้องการแก้ไข</p>
                    <Link href="/quests" className="text-blue-500 mt-4 inline-block">กลับไปหน้า Quest Log</Link>
                </main>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        const updates: Partial<Quest> = {
            title: title.trim(),
            description: description.trim(),
            difficulty,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            reward: reward.trim() || undefined,
        };

        updateQuest(selectedYear, questId, updates);
        router.push('/quests');
    };

    const handleDelete = () => {
        deleteQuest(selectedYear, questId);
        router.push('/quests');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/quests">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Sword className="w-6 h-6 text-blue-500" />
                                แก้ไข Quest
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {questId}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                    >
                        <p className="text-red-700 dark:text-red-400 font-bold mb-3">ต้องการลบ Quest นี้ใช่หรือไม่?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm"
                            >
                                ใช่, ลบเลย
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </motion.div>
                )}

                <PaperCard className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ชื่อ Quest *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="เช่น ไปเที่ยวทะเลด้วยกัน"
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รายละเอียด
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="อธิบายรายละเอียดของ Quest..."
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
                            />
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ความยาก: {difficulty}/5
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setDifficulty(level as 1 | 2 | 3 | 4 | 5)}
                                        className={`
                                            flex-1 py-2 rounded-lg font-medium transition-all
                                            ${difficulty >= level
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                            }
                                        `}
                                    >
                                        <Star className={`w-4 h-4 mx-auto ${difficulty >= level ? 'fill-white' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reward */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รางวัล (ไม่จำเป็น)
                            </label>
                            <input
                                type="text"
                                value={reward}
                                onChange={(e) => setReward(e.target.value)}
                                placeholder="เช่น Beach Memory Badge!"
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                แท็ก (คั่นด้วย ,)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="เช่น trip, adventure, beach"
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </motion.button>
                    </form>
                </PaperCard>
            </main>
        </div>
    );
}
