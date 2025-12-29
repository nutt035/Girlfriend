'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Play, Pause, RotateCcw, User } from 'lucide-react';

export default function ChatEpisodePage({ params }: { params: Promise<{ episodeId: string }> }) {
    const { episodeId } = use(params);
    const { universeData, selectedYear } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const episode = yearData?.chatEpisodes.find(e => e.id === episodeId);

    const [visibleMessages, setVisibleMessages] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTyping, setShowTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { me, you } = universeData.meta.people;

    useEffect(() => {
        if (!isPlaying || !episode) return;

        if (visibleMessages >= episode.messages.length) {
            setIsPlaying(false);
            return;
        }

        // Show typing indicator
        setShowTyping(true);

        const typingTimer = setTimeout(() => {
            setShowTyping(false);
            setVisibleMessages(prev => prev + 1);
        }, 1000 + Math.random() * 500);

        return () => clearTimeout(typingTimer);
    }, [isPlaying, visibleMessages, episode]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [visibleMessages, showTyping]);

    const handlePlay = () => {
        if (visibleMessages >= (episode?.messages.length || 0)) {
            setVisibleMessages(0);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
        setShowTyping(false);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setShowTyping(false);
        setVisibleMessages(0);
    };

    if (!episode) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        ไม่พบบทสนทนา
                    </h1>
                    <Link href="/chat">
                        <button className="mt-4 px-4 py-2 rounded-xl bg-pink-500 text-white font-medium">
                            กลับไปหน้า Chatlog
                        </button>
                    </Link>
                </main>
            </div>
        );
    }

    const displayedMessages = episode.messages.slice(0, visibleMessages);
    const nextMessage = episode.messages[visibleMessages];

    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader />

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/chat">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {episode.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(episode.date, 'long')}
                        </p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-gradient-to-b from-pink-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 p-4 mb-4">
                    <div className="space-y-3">
                        <AnimatePresence>
                            {displayedMessages.map((message, index) => {
                                const isMe = message.from === 'me';

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                        ${isMe ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'}
                      `}>
                                                {isMe ? me[0] : you[0]}
                                            </div>

                                            {/* Message Bubble */}
                                            <div className={`
                        px-4 py-2 rounded-2xl
                        ${isMe
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm'
                                                    : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-sm shadow-sm'
                                                }
                      `}>
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        <AnimatePresence>
                            {showTyping && nextMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex ${nextMessage.from === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end gap-2 ${nextMessage.from === 'me' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                      ${nextMessage.from === 'me' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'}
                    `}>
                                            {nextMessage.from === 'me' ? me[0] : you[0]}
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-700 shadow-sm">
                                            <div className="flex gap-1">
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                />
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                />
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 py-4">
                    <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                        onClick={isPlaying ? handlePause : handlePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </motion.button>

                    <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px] text-center">
                        {visibleMessages} / {episode.messages.length}
                    </div>
                </div>
            </main>
        </div>
    );
}
