'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import { Entry } from '@/types';

export default function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { selectedYear, universeData, updateEntry, deleteEntry } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const entry = yearData?.entries.find(e => e.id === id);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [mood, setMood] = useState(7);
    const [tagsInput, setTagsInput] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [newPhoto, setNewPhoto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (entry) {
            setTitle(entry.title);
            setContent(entry.content);
            setDate(entry.date);
            setMood(entry.mood);
            setTagsInput(entry.tags.join(', '));
            setPhotos(entry.photos);
        }
    }, [entry]);

    if (!entry) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <main className="max-w-2xl mx-auto px-4 py-8 text-center">
                    <p className="text-gray-500">ไม่พบบันทึกที่ต้องการแก้ไข</p>
                    <Link href="/journal" className="text-amber-500 mt-4 inline-block">กลับไปหน้า Journal</Link>
                </main>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('กรุณากรอกหัวข้อและเนื้อหา');
            return;
        }

        setIsSubmitting(true);

        const updates: Partial<Entry> = {
            title: title.trim(),
            content: content.trim(),
            date,
            mood,
            tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
            photos
        };

        updateEntry(selectedYear, id, updates);
        router.push(`/journal/${id}`);
    };

    const handleDelete = () => {
        deleteEntry(selectedYear, id);
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/journal/${id}`}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            แก้ไขบันทึก
                        </h1>
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
                        <p className="text-red-700 dark:text-red-400 font-bold mb-3">ต้องการลบบันทึกนี้ใช่หรือไม่?</p>
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
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 outline-none"
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
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none outline-none"
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
                                className="w-full accent-amber-500 cursor-pointer"
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
                                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 outline-none"
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
                                    className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 outline-none"
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
                                            <span className="truncate max-w-[150px]">{photo}</span>
                                            <button type="button" onClick={() => removePhoto(index)} className="hover:text-red-500">
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
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </motion.button>
                    </PaperCard>
                </form>
            </main>
        </div>
    );
}
