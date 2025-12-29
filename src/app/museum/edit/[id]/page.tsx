'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditMomentPage() {
    const router = useRouter();
    const params = useParams();
    const momentId = params.id as string;

    const { universeData, selectedYear, updateMoment, deleteMoment } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const moment = yearData?.moments.find(m => m.id === momentId);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (moment) {
            setTitle(moment.title);
            setDate(moment.date);
            setDescription(moment.description || '');
            setImage(moment.image || '');
            setTags(moment.tags || []);
        } else if (yearData) {
            // Moment not found in this year, maybe redirect
            router.push('/museum');
        }
    }, [moment, yearData, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !date) return;

        updateMoment(selectedYear, momentId, {
            title: title.trim(),
            date,
            description: description.trim(),
            image: image.trim(),
            tags,
            photos: image.trim() ? [image.trim()] : (moment?.photos || [])
        });

        router.push(`/museum/${momentId}`);
    };

    const handleDelete = () => {
        if (confirm('ลบความทรงจำนี้ใช่ไหม? จะกู้คืนไม่ได้แล้วนะ...')) {
            deleteMoment(selectedYear, momentId);
            router.push('/museum');
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    if (!moment) return null;

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href={`/museum/${momentId}`}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                แก้ไขความทรงจำ
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ปรับแต่งเรื่องราวของเราให้สมบูรณ์ขึ้น
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                        title="ลบความทรงจำ"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PaperCard className="p-6 space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ชื่อความทรงจำ
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all font-serif"
                                placeholder="เช่น วันที่ไปดูดอกไม้ด้วยกัน..."
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                วันที่
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all"
                                required
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รูปภาพ (URL)
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        placeholder="ใส่ลิงก์รูปภาพ..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                เล่าเรื่องราว
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all min-h-[120px] font-serif"
                                placeholder="เรื่องราวดีๆ ที่เกิดขึ้นในวันนี้..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                แท็ก (#)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <div className="flex-1 relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        placeholder="เพิ่มแท็ก..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-500 text-sm font-medium"
                                >
                                    เพิ่ม
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-slate-800/50 text-xs text-gray-600 dark:text-gray-400 border border-paper-200 dark:border-slate-700"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </PaperCard>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 dark:shadow-none font-bold text-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        บันทึกการแก้ไข
                    </motion.button>
                </form>
            </main>
        </div>
    );
}
