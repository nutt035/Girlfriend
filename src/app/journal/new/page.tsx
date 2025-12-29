'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Entry } from '@/types';

export default function NewJournalPage() {
    const router = useRouter();
    const { selectedYear, addEntry } = useAppStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mood, setMood] = useState(7);
    const [tagsInput, setTagsInput] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [newPhoto, setNewPhoto] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('กรุณากรอกหัวข้อและเนื้อหา');
            return;
        }

        const entry: Entry = {
            id: generateId('e'),
            title: title.trim(),
            content: content.trim(),
            date,
            mood,
            tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
            photos
        };

        addEntry(selectedYear, entry);
        router.push('/journal');
    };

    const addPhoto = () => {
        if (newPhoto.trim()) {
            setPhotos([...photos, newPhoto.trim()]);
            setNewPhoto('');
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/journal">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        เพิ่มบันทึกใหม่
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <PaperCard lined className="p-6 space-y-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                วันที่
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                หัวข้อ *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="วันนี้เกิดอะไรขึ้น..."
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                เนื้อหา *
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="เล่าเรื่องราวของวันนี้..."
                                rows={8}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                required
                            />
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ความรู้สึก (Mood): {mood}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={mood}
                                onChange={(e) => setMood(Number(e.target.value))}
                                className="w-full accent-amber-500"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>😢 1</span>
                                <span>🥰 10</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags (คั่นด้วยคอมม่า)
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="date, romantic, celebration"
                                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Photos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                รูปภาพ (URL)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newPhoto}
                                    onChange={(e) => setNewPhoto(e.target.value)}
                                    placeholder="/images/photo.jpg"
                                    className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="button"
                                    onClick={addPhoto}
                                    className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            {photos.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {photos.map((photo, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {photo}
                                            <button type="button" onClick={() => removePhoto(index)}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            บันทึก
                        </motion.button>
                    </PaperCard>
                </form>
            </main>
        </div>
    );
}
