'use client';

import { motion } from 'framer-motion';
import PaperCard from './PaperCard';
import { useAppStore } from '@/lib/store';
import { computeDaysTogether } from '@/lib/utils';
import { Heart, Calendar, Star, Camera, BookOpen, Trophy } from 'lucide-react';

export default function LoveStats() {
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];

    const daysTogether = computeDaysTogether(universeData.meta.relationshipStartDate);
    const weeks = Math.floor(daysTogether / 7);
    const months = Math.floor(daysTogether / 30);
    const years = Math.floor(daysTogether / 365);

    // Calculate totals across all years
    const totalEntries = Object.values(universeData.years).reduce(
        (sum, year) => sum + year.entries.length, 0
    );
    const totalPhotos = Object.values(universeData.years).reduce(
        (sum, year) => sum + year.photos.length, 0
    );
    const totalMoments = Object.values(universeData.years).reduce(
        (sum, year) => sum + year.moments.length, 0
    );
    const totalQuests = Object.values(universeData.years).reduce(
        (sum, year) => sum + year.quests.filter(q => q.status === 'done').length, 0
    );

    const stats = [
        { icon: <Heart className="w-3 h-3" />, value: daysTogether, label: 'วันที่รักกัน', color: 'from-pink-500 to-rose-500' },
        { icon: <Calendar className="w-3 h-3" />, value: weeks, label: 'สัปดาห์', color: 'from-violet-500 to-purple-500' },
        { icon: <Star className="w-3 h-3" />, value: months, label: 'เดือน', color: 'from-amber-500 to-orange-500' },
        { icon: <Trophy className="w-3 h-3" />, value: years, label: 'ปี', color: 'from-emerald-500 to-teal-500' },
    ];

    const memories = [
        { icon: <BookOpen className="w-3.5 h-3.5" />, value: totalEntries, label: 'Journal', color: 'text-amber-500' },
        { icon: <Camera className="w-3.5 h-3.5" />, value: totalPhotos, label: 'รูปภาพ', color: 'text-sky-500' },
        { icon: <Star className="w-3.5 h-3.5" />, value: totalMoments, label: 'Moments', color: 'text-rose-500' },
        { icon: <Trophy className="w-3.5 h-3.5" />, value: totalQuests, label: 'Quests', color: 'text-emerald-500' },
    ];

    // Milestones
    const milestones = [
        { days: 100, label: '100 วัน', emoji: '💯' },
        { days: 365, label: '1 ปี', emoji: '🎂' },
        { days: 500, label: '500 วัน', emoji: '🌟' },
        { days: 730, label: '2 ปี', emoji: '💕' },
        { days: 1000, label: '1,000 วัน', emoji: '🎊' },
        { days: 1095, label: '3 ปี', emoji: '💖' },
    ];

    const passedMilestones = milestones.filter(m => daysTogether >= m.days);
    const nextMilestone = milestones.find(m => daysTogether < m.days);

    return (
        <PaperCard className="p-3 sm:p-4">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                สถิติความรัก
            </h3>

            {/* Time Together - Compact Grid */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                        <div className={`inline-flex p-1 rounded-md bg-gradient-to-br ${stat.color} text-white mb-1`}>
                            {stat.icon}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                            {stat.value.toLocaleString()}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Memories Count - Inline */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-pink-50 dark:bg-pink-900/10 mb-3">
                {memories.map((item) => (
                    <div key={item.label} className="text-center flex-1">
                        <div className={`${item.color} flex justify-center`}>{item.icon}</div>
                        <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Milestones - Compact */}
            <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Milestones</div>
                <div className="flex flex-wrap gap-1">
                    {passedMilestones.map((m) => (
                        <span
                            key={m.days}
                            className="px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[10px] font-medium"
                        >
                            {m.emoji} {m.label}✓
                        </span>
                    ))}
                    {nextMilestone && (
                        <span className="px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-medium">
                            {nextMilestone.emoji} {nextMilestone.label} (อีก{nextMilestone.days - daysTogether}วัน)
                        </span>
                    )}
                </div>
            </div>
        </PaperCard>
    );
}
