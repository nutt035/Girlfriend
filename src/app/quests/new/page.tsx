'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { ArrowLeft, Sword, Star, Check } from 'lucide-react';
import { Quest } from '@/types';

export default function NewQuestPage() {
    const router = useRouter();
    const { selectedYear, addQuest } = useAppStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [reward, setReward] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        const newQuest: Quest = {
            id: generateId(),
            title: title.trim(),
            description: description.trim(),
            difficulty,
            status: 'todo',
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            reward: reward.trim() || undefined,
        };

        addQuest(selectedYear, newQuest);
        router.push('/quests');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
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
                            <Sword className="w-6 h-6 text-violet-500" />
                            เพิ่ม Quest ใหม่
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ปี {selectedYear}</p>
                    </div>
                </div>

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
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
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
                                                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
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
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่ม Quest'}
                        </motion.button>
                    </form>
                </PaperCard>
            </main>
        </div>
    );
}
