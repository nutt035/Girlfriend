'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PaperCard from './PaperCard';
import { useAppStore } from '@/lib/store';
import { Clock, Plus } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isPast: false,
    };
}

export default function CountdownWidget() {
    const { universeData } = useAppStore();
    const countdowns = universeData.countdowns || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    // Filter out past events and get current countdown
    const activeCountdowns = countdowns.filter(c => {
        const now = new Date();
        const target = new Date(c.date);
        return target.getTime() > now.getTime();
    });

    const currentCountdown = activeCountdowns[activeIndex % Math.max(activeCountdowns.length, 1)];

    useEffect(() => {
        if (!currentCountdown) return;

        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft(currentCountdown.date));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [currentCountdown]);

    // Show "Add Countdown" when no countdowns
    if (!currentCountdown || activeCountdowns.length === 0) {
        return (
            <PaperCard className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-100">Countdown</span>
                </div>
                <div className="text-center py-4">
                    <div className="text-4xl mb-3">⏰</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        ยังไม่มี Countdown
                    </p>
                    <Link href="/countdown/new">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            เพิ่ม Countdown
                        </motion.button>
                    </Link>
                </div>
            </PaperCard>
        );
    }

    if (!timeLeft) {
        return null;
    }

    return (
        <PaperCard className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-100">Countdown</span>
                </div>

                <div className="flex items-center gap-2">
                    {currentCountdown && (
                        <Link href={`/countdown/edit/${currentCountdown.id}`}>
                            <button className="text-[10px] sm:text-xs text-gray-400 hover:text-pink-500 transition-colors mr-1">
                                แก้ไข
                            </button>
                        </Link>
                    )}
                    {activeCountdowns.length > 1 && (
                        <div className="flex gap-1">
                            {activeCountdowns.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex % activeCountdowns.length
                                        ? 'bg-pink-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2">{currentCountdown.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {currentCountdown.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(currentCountdown.date).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </p>

                <div className="grid grid-cols-4 gap-2">
                    {[
                        { value: timeLeft.days, label: 'วัน' },
                        { value: timeLeft.hours, label: 'ชม.' },
                        { value: timeLeft.minutes, label: 'นาที' },
                        { value: timeLeft.seconds, label: 'วิ' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
                        >
                            <motion.div
                                key={item.value}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400"
                            >
                                {String(item.value).padStart(2, '0')}
                            </motion.div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PaperCard>
    );
}
