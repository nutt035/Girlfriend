'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { randomMemory, getMoodEmoji, formatDate } from '@/lib/utils';
import PaperCard from './PaperCard';
import { Shuffle, ExternalLink, Heart, Camera, Sparkles, StickyNote } from 'lucide-react';

export default function RandomMemoryCard() {
    const router = useRouter();
    const { universeData, selectedYear } = useAppStore();
    const [memory, setMemory] = useState(() => randomMemory(universeData, selectedYear));
    const [isShuffling, setIsShuffling] = useState(false);

    const shuffle = useCallback(() => {
        setIsShuffling(true);
        setTimeout(() => {
            setMemory(randomMemory(universeData, selectedYear));
            setIsShuffling(false);
        }, 300);
    }, [universeData, selectedYear]);

    const getIcon = () => {
        if (!memory) return <Sparkles className="w-5 h-5" />;
        switch (memory.type) {
            case 'entry': return <StickyNote className="w-5 h-5" />;
            case 'moment': return <Heart className="w-5 h-5" />;
            case 'photo': return <Camera className="w-5 h-5" />;
            case 'note': return <Heart className="w-5 h-5" />;
            default: return <Sparkles className="w-5 h-5" />;
        }
    };

    const getContent = () => {
        if (!memory) return { title: 'ไม่มีความทรงจำ', subtitle: 'เพิ่มข้อมูลใหม่เลย!' };

        switch (memory.type) {
            case 'entry':
                return {
                    title: memory.data.title,
                    subtitle: `${formatDate(memory.data.date)} ${getMoodEmoji(memory.data.mood)}`,
                    preview: memory.data.content.slice(0, 100) + '...'
                };
            case 'moment':
                return {
                    title: memory.data.title,
                    subtitle: formatDate(memory.data.date),
                    preview: memory.data.description
                };
            case 'photo':
                return {
                    title: memory.data.caption,
                    subtitle: formatDate(memory.data.date),
                    preview: memory.data.tags.map(t => `#${t}`).join(' ')
                };
            case 'note':
                return {
                    title: 'โน้ต',
                    subtitle: formatDate(memory.data.date),
                    preview: memory.data.content
                };
        }
    };

    const content = getContent();

    return (
        <PaperCard className="p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">สุ่มความทรงจำ</h3>
            </div>

            {/* Memory Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={memory ? `${memory.type}-${memory.route}` : 'empty'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isShuffling ? 0 : 1, y: isShuffling ? -20 : 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4"
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                            {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                                {content.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {content.subtitle}
                            </p>
                            {content.preview && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                    {content.preview}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2">
                <motion.button
                    onClick={shuffle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
            bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                    <motion.div
                        animate={{ rotate: isShuffling ? 360 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Shuffle className="w-4 h-4" />
                    </motion.div>
                    Shuffle
                </motion.button>

                {memory && (
                    <motion.button
                        onClick={() => router.push(memory.route)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
              bg-gradient-to-r from-rose-500 to-pink-500 text-white
              shadow-lg shadow-rose-500/25 font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open
                    </motion.button>
                )}
            </div>
        </PaperCard>
    );
}
