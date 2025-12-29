'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Clock, Check, Trash2 } from 'lucide-react';
import { CountdownEvent } from '@/types';

export default function EditCountdownPage() {
    const router = useRouter();
    const params = useParams();
    const countdownId = params.id as string;

    const { universeData, updateCountdown, deleteCountdown } = useAppStore();
    const countdown = (universeData.countdowns || []).find(c => c.id === countdownId);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [icon, setIcon] = useState('📅');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (countdown) {
            setTitle(countdown.title);
            setDate(countdown.date);
            setIcon(countdown.icon);
            setDescription(countdown.description || '');
        }
    }, [countdown]);

    if (!countdown) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <p className="text-gray-500">ไม่พบ Countdown ที่ต้องการแก้ไข</p>
                    <Link href="/" className="text-blue-500 mt-4 inline-block">กลับหน้าแรก</Link>
                </main>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;

        setIsSubmitting(true);

        const updates: Partial<CountdownEvent> = {
            title: title.trim(),
            date,
            icon,
            description: description.trim() || undefined,
        };

        updateCountdown(countdownId, updates);
        router.push('/');
    };

    const handleDelete = () => {
        deleteCountdown(countdownId);
        router.push('/');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
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
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-pink-500" />
                                แก้ไข Countdown
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">แก้ไขกิจกรรมที่กำลังจะมาถึง</p>
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
                        <p className="text-red-700 dark:text-red-400 font-bold mb-3">ต้องการลบ Countdown นี้ใช่หรือไม่?</p>
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
                                กิจกรรม *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="เช่น วันครบรอบเรา"
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
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
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
                                required
                            />
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ไอคอน: {icon}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['📅', '❤️', '✈️', '🎂', '🎓', '🍱', '🎥', '🎁', '🏩', '🏖️'].map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setIcon(emoji)}
                                        className={`
                                            w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all
                                            ${icon === emoji ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-500' : 'bg-gray-100 dark:bg-gray-800'}
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
                                placeholder="โน้ตเพิ่มเติม..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 resize-none outline-none"
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!title.trim() || !date || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
