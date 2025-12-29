'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { thaiProvinces } from '@/data/thai-provinces';
import { ArrowLeft, MapPin, Check, Heart, Star } from 'lucide-react';
import { VisitedProvince } from '@/types';

export default function AddProvincePage() {
    const router = useRouter();
    const { selectedYear, addVisitedProvince, addWishlistProvince, universeData } = useAppStore();

    const [selectedProvince, setSelectedProvince] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [mode, setMode] = useState<'visited' | 'wishlist'>('visited');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    // Get already visited/wishlist provinces
    const visitedIds = new Set(
        Object.values(universeData.years).flatMap(y => y.visitedProvinces?.map(p => p.provinceId) || [])
    );
    const wishlistIds = new Set(universeData.wishlistProvinces || []);

    // Filter provinces
    const filteredProvinces = thaiProvinces.filter(p =>
        p.nameTh.includes(search) || p.nameEn.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProvince) return;

        setIsSubmitting(true);

        if (mode === 'visited') {
            const newProvince: VisitedProvince = {
                provinceId: selectedProvince,
                visitDate,
                note: note.trim() || undefined,
            };
            addVisitedProvince(selectedYear, newProvince);
        } else {
            addWishlistProvince(selectedProvince);
        }

        router.push('/map');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/map">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-pink-500" />
                            เพิ่มจังหวัด
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ปี {selectedYear}</p>
                    </div>
                </div>

                <PaperCard className="p-4 sm:p-6">
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setMode('visited')}
                            className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${mode === 'visited'
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Heart className="w-4 h-4" />
                            เคยไปแล้ว
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('wishlist')}
                            className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${mode === 'wishlist'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Star className="w-4 h-4" />
                            อยากไป
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ค้นหาจังหวัด
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="พิมพ์ชื่อจังหวัด..."
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Province List */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                เลือกจังหวัด *
                            </label>
                            <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
                                {filteredProvinces.map((province) => {
                                    const isVisited = visitedIds.has(province.id);
                                    const isWishlist = wishlistIds.has(province.id);
                                    const isSelected = selectedProvince === province.id;

                                    return (
                                        <button
                                            key={province.id}
                                            type="button"
                                            onClick={() => setSelectedProvince(province.id)}
                                            disabled={(mode === 'visited' && isVisited) || (mode === 'wishlist' && (isWishlist || isVisited))}
                                            className={`
                        w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors text-sm
                        ${isSelected
                                                    ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500'
                                                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                        ${isVisited || isWishlist ? 'opacity-50' : ''}
                      `}
                                        >
                                            <span className="flex-1">{province.nameTh}</span>
                                            <span className="text-xs text-gray-400">{province.nameEn}</span>
                                            {isVisited && <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />}
                                            {isWishlist && !isVisited && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Visit Date (only for visited mode) */}
                        {mode === 'visited' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    วันที่ไป
                                </label>
                                <input
                                    type="date"
                                    value={visitDate}
                                    onChange={(e) => setVisitDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Note (only for visited mode) */}
                        {mode === 'visited' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    โน้ต (ไม่จำเป็น)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="บันทึกความทรงจำ..."
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                                />
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!selectedProvince || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                w-full py-3 rounded-xl text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                ${mode === 'visited'
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                }
              `}
                        >
                            <Check className="w-5 h-5" />
                            {isSubmitting ? 'กำลังบันทึก...' : mode === 'visited' ? 'เพิ่มจังหวัดที่เคยไป' : 'เพิ่มจังหวัดที่อยากไป'}
                        </motion.button>
                    </form>
                </PaperCard>
            </main>
        </div>
    );
}
