'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { ArrowLeft, Clock, Check, Sparkles } from 'lucide-react';
import { CountdownEvent } from '@/types';

const EMOJI_OPTIONS = ['💕', '🎂', '✈️', '🎄', '🌟', '🎓', '💍', '🏠', '🎁', '🎉', '❤️', '🌸'];

export default function NewCountdownPage() {
    const router = useRouter();
    const { addCountdown } = useAppStore();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [icon, setIcon] = useState('💕');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;

        setIsSubmitting(true);

        const newCountdown: CountdownEvent = {
            id: generateId(),
            title: title.trim(),
            date,
            icon,
            description: description.trim() || undefined,
        };

        addCountdown(newCountdown);
        router.push('/');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
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
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-pink-500" />
                            เพิ่ม Countdown
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">นับถอยหลังถึงวันพิเศษ</p>
                    </div>
                </div>

                <PaperCard className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ชื่อ Event *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="เช่น ครบรอบ 3 ปี"
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                วันที่ *
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ไอคอน
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setIcon(emoji)}
                                        className={`
                      w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all
                      ${icon === emoji
                                                ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-500'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }
                    `}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รายละเอียด (ไม่จำเป็น)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="รายละเอียดเพิ่มเติม..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Preview */}
                        {title && date && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 border border-pink-100 dark:border-pink-900/20">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    Preview
                                </div>
                                <div className="text-2xl mb-1">{icon}</div>
                                <div className="font-bold text-gray-800 dark:text-gray-100">{title}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!title.trim() || !date || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่ม Countdown'}
                        </motion.button>
                    </form>
                </PaperCard>
            </main>
        </div>
    );
}
