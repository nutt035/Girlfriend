'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Tag } from 'lucide-react';
import Link from 'next/link';

export default function AddMomentPage() {
    const router = useRouter();
    const { addMoment, selectedYear } = useAppStore();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !date) return;

        const newMoment: any = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            description: description.trim(),
            image: image.trim() || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800',
            tags,
            category: 'firsts', // Default category
            photos: image.trim() ? [image.trim()] : []
        };

        addMoment(selectedYear, newMoment);
        router.push('/museum');
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

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/museum">
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
                            <Sparkles className="w-6 h-6 text-pink-500" />
                            เพิ่มความทรงจำใหม่
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            เก็บรักษาความสวยงามของวันนี้ไว้ที่นี่
                        </p>
                    </div>
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
                            <p className="text-[10px] text-gray-400 mt-1">
                                * หากไม่ใส่ เราจะใช้รูปภาพน่ารักๆ แทนให้จ้า
                            </p>
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
                        บันทึกความทรงจำ
                    </motion.button>
                </form>
            </main>
        </div>
    );
}
