'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Landmark, Heart, Plane, Laugh, Sparkles } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

type RoomType = 'firsts' | 'trips' | 'inside_jokes';

const rooms: { id: RoomType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'firsts', label: 'Firsts', icon: <Heart className="w-5 h-5" />, color: 'from-rose-500 to-pink-500' },
    { id: 'trips', label: 'Trips', icon: <Plane className="w-5 h-5" />, color: 'from-sky-500 to-blue-500' },
    { id: 'inside_jokes', label: 'Inside Jokes', icon: <Laugh className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
];

export default function MuseumPage() {
    const [activeRoom, setActiveRoom] = useState<RoomType>('firsts');
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];

    const exhibits = yearData?.moments.filter(m => m.category === activeRoom) || [];

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
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
                            <Landmark className="w-8 h-8 text-violet-500" />
                            Museum
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">นิทรรศการความรักของเรา</p>
                    </div>
                </div>

                {/* Room Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {rooms.map((room) => (
                        <motion.button
                            key={room.id}
                            onClick={() => setActiveRoom(room.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all
                ${activeRoom === room.id
                                    ? `bg-gradient-to-r ${room.color} text-white shadow-lg`
                                    : 'bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800'
                                }
              `}
                        >
                            {room.icon}
                            {room.label}
                        </motion.button>
                    ))}
                </div>

                {/* Exhibits Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeRoom}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {exhibits.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon={Sparkles}
                                    title="ห้องนี้ยังว่างอยู่"
                                    description="เพิ่มความทรงจำใหม่ๆ เพื่อนำมาจัดแสดงในห้องนี้นะ"
                                    actionLabel="เพิ่ม Moment แรก"
                                    actionHref="/museum/add"
                                />
                            </div>
                        ) : (
                            exhibits.map((exhibit, index) => (
                                <motion.div
                                    key={exhibit.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/museum/${exhibit.id}`}>
                                        <PaperCard hoverable className="h-full overflow-hidden">
                                            {/* Exhibit Image Placeholder */}
                                            <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                                {exhibit.photos.length > 0 ? (
                                                    <span className="text-4xl">📷</span>
                                                ) : (
                                                    <span className="text-4xl">
                                                        {exhibit.category === 'firsts' && '💕'}
                                                        {exhibit.category === 'trips' && '✈️'}
                                                        {exhibit.category === 'inside_jokes' && '😂'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Exhibit Info */}
                                            <div className="p-4">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {formatDate(exhibit.date, 'long')}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                                                    {exhibit.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                    {exhibit.description}
                                                </p>

                                                {exhibit.isTopMoment && (
                                                    <span className="inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                                        ⭐ Top Moment
                                                    </span>
                                                )}
                                            </div>
                                        </PaperCard>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
