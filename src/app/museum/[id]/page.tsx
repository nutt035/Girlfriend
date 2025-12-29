'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag, Link as LinkIcon, Heart, Plane, Laugh, Edit } from 'lucide-react';

export default function MuseumDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const exhibit = yearData?.moments.find(m => m.id === id);

    if (!exhibit) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        ไม่พบ Exhibit
                    </h1>
                    <Link href="/museum">
                        <button className="mt-4 px-4 py-2 rounded-xl bg-violet-500 text-white font-medium">
                            กลับไปหน้า Museum
                        </button>
                    </Link>
                </main>
            </div>
        );
    }

    const relatedEntries = yearData?.entries.filter(e =>
        exhibit.relatedEntryIds?.includes(e.id)
    ) || [];

    const getCategoryIcon = () => {
        switch (exhibit.category) {
            case 'firsts': return <Heart className="w-6 h-6" />;
            case 'trips': return <Plane className="w-6 h-6" />;
            case 'inside_jokes': return <Laugh className="w-6 h-6" />;
        }
    };

    const getCategoryColor = () => {
        switch (exhibit.category) {
            case 'firsts': return 'from-rose-500 to-pink-500';
            case 'trips': return 'from-sky-500 to-blue-500';
            case 'inside_jokes': return 'from-amber-500 to-orange-500';
        }
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Back */}
                <Link href="/museum">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">กลับ</span>
                    </motion.button>
                </Link>

                {/* Exhibit Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PaperCard className="overflow-hidden">
                        {/* Hero Image */}
                        <div className={`aspect-video bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center`}>
                            {exhibit.photos.length > 0 ? (
                                <div className="text-white text-center">
                                    <span className="text-6xl">📷</span>
                                    <p className="mt-2">{exhibit.photos[0]}</p>
                                </div>
                            ) : (
                                <span className="text-8xl text-white/50">
                                    {exhibit.category === 'firsts' && '💕'}
                                    {exhibit.category === 'trips' && '✈️'}
                                    {exhibit.category === 'inside_jokes' && '😂'}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getCategoryColor()} text-white text-sm font-medium`}>
                                    {getCategoryIcon()}
                                    {exhibit.category === 'firsts' && 'Firsts'}
                                    {exhibit.category === 'trips' && 'Trips'}
                                    {exhibit.category === 'inside_jokes' && 'Inside Jokes'}
                                </div>

                                <Link href={`/museum/edit/${id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-500 text-sm font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        แก้ไข
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {exhibit.title}
                            </h1>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(exhibit.date, 'long')}</span>
                                {exhibit.isTopMoment && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm">
                                        ⭐ Top Moment
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {exhibit.description}
                                </p>
                            </div>

                            {/* Photos Gallery */}
                            {exhibit.photos.length > 1 && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        รูปภาพเพิ่มเติม
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {exhibit.photos.slice(1).map((photo, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                            >
                                                <span className="text-2xl">📷</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related Entries */}
                            {relatedEntries.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                        <LinkIcon className="w-5 h-5" />
                                        บันทึกที่เกี่ยวข้อง
                                    </h3>
                                    <div className="space-y-2">
                                        {relatedEntries.map((entry) => (
                                            <Link key={entry.id} href={`/journal/${entry.id}`}>
                                                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                    <p className="font-medium text-gray-800 dark:text-gray-100">
                                                        {entry.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(entry.date)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </PaperCard>
                </motion.div>
            </main>
        </div>
    );
}
