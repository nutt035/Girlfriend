'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Calendar, Type, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function EditChatEpisodePage() {
    const params = useParams();
    const router = useRouter();
    const episodeId = params.id as string;
    const { universeData, selectedYear, updateChatEpisode } = useAppStore();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const episode = universeData.years[selectedYear]?.chatEpisodes.find(ep => ep.id === episodeId);
        if (episode) {
            setTitle(episode.title);
            setDate(episode.date);
            setDescription(episode.description || '');
            setLoading(false);
        } else {
            router.push('/chat');
        }
    }, [episodeId, selectedYear, universeData, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateChatEpisode(selectedYear, episodeId, {
            title: title.trim(),
            date,
            description: description.trim()
        });

        router.push('/chat');
    };

    if (loading) return null;

    return (
        <div className="min-h-screen pb-20 px-4 pt-4 paper-texture">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/chat"
                        className="p-2 rounded-xl bg-white/50 border border-pink-100 text-pink-500"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">แก้ไขตอนแชท</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Type className="w-4 h-4" /> ชื่อตอน
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                placeholder="เช่น คุยกันครั้งแรก..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> วันที่
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> รายละเอียด (ถ้ามี)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[100px]"
                                placeholder="เล่าสั้นๆ ว่าคุยเรื่องอะไรกัน..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-3xl font-bold shadow-lg shadow-pink-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Save className="w-5 h-5" /> บันทึกการแก้ไข
                    </button>
                </form>
            </div>
        </div>
    );
}
