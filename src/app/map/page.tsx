'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { thaiProvinces, getProvinceById, ThaiProvince } from '@/data/thai-provinces';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Map as MapIcon, MapPinned, Star, Heart, Calendar, Filter, Trash2 } from 'lucide-react';
import { ThailandMap } from '@/components/ThailandMap';

type FilterType = 'all' | 'visited' | 'wishlist' | 'not-visited';

export default function MapPage() {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

    const { universeData, selectedYear, removeVisitedProvince, removeWishlistProvince, addWishlistProvince } = useAppStore();

    const handleToggleWishlist = () => {
        if (!selectedProvince) return;
        if (wishlistProvinces.has(selectedProvince)) {
            removeWishlistProvince(selectedProvince);
        } else {
            addWishlistProvince(selectedProvince);
        }
    };

    const handleRemoveVisit = () => {
        if (!selectedProvince) return;
        if (confirm('ลบข้อมูลการไปจังหวัดนี้ใช่ไหม?')) {
            removeVisitedProvince(selectedYear, selectedProvince);
        }
    };
    const yearData = universeData.years[selectedYear];

    // Get all visited provinces across all years
    const allVisitedProvinces = useMemo(() => {
        const visited = new Set<string>();
        Object.values(universeData.years).forEach(year => {
            year.visitedProvinces?.forEach(vp => visited.add(vp.provinceId));
        });
        return visited;
    }, [universeData.years]);

    // Current year's visited provinces
    const currentYearVisited = useMemo(() => {
        return new Set(yearData?.visitedProvinces?.map(vp => vp.provinceId) || []);
    }, [yearData]);

    // Wishlist provinces
    const wishlistProvinces = useMemo(() => {
        return new Set(universeData.wishlistProvinces || []);
    }, [universeData.wishlistProvinces]);

    // Filter provinces
    const filteredProvinces = useMemo(() => {
        switch (filter) {
            case 'visited':
                return thaiProvinces.filter(p => allVisitedProvinces.has(p.id));
            case 'wishlist':
                return thaiProvinces.filter(p => wishlistProvinces.has(p.id));
            case 'not-visited':
                return thaiProvinces.filter(p => !allVisitedProvinces.has(p.id));
            default:
                return thaiProvinces;
        }
    }, [filter, allVisitedProvinces, wishlistProvinces]);

    const selectedProvinceData = selectedProvince ? getProvinceById(selectedProvince) : null;
    const visitInfo = yearData?.visitedProvinces?.find(vp => vp.provinceId === selectedProvince);

    const getProvinceColor = (province: ThaiProvince) => {
        if (allVisitedProvinces.has(province.id)) {
            // Visited - pink shades based on current year vs other years
            if (currentYearVisited.has(province.id)) {
                return 'bg-pink-500 hover:bg-pink-400'; // Visited THIS year
            }
            return 'bg-pink-300 hover:bg-pink-200'; // Visited in other years
        }
        if (wishlistProvinces.has(province.id)) {
            return 'bg-amber-400 hover:bg-amber-300'; // Wishlist
        }
        return 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'; // Not visited
    };

    const stats = {
        visited: allVisitedProvinces.size,
        total: thaiProvinces.length,
        thisYear: currentYearVisited.size,
        wishlist: wishlistProvinces.size
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
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
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <MapIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
                                แผนที่ประเทศไทย
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                จังหวัดที่เราไปด้วยกัน
                            </p>
                        </div>
                    </div>

                    <Link href="/map/add">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg font-medium text-sm"
                        >
                            <span className="text-lg">+</span>
                            <span className="hidden sm:inline">เพิ่มจังหวัด</span>
                        </motion.button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <PaperCard className="p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-pink-500">{stats.visited}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">เคยไปด้วยกัน</div>
                    </PaperCard>
                    <PaperCard className="p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{stats.thisYear}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ปี {selectedYear}</div>
                    </PaperCard>
                    <PaperCard className="p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-amber-500">{stats.wishlist}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">อยากไป</div>
                    </PaperCard>
                    <PaperCard className="p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-500">{stats.total - stats.visited}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ยังไม่เคยไป</div>
                    </PaperCard>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-pink-500" />
                        <span className="text-gray-600 dark:text-gray-400">เคยไปปีนี้</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-pink-300" />
                        <span className="text-gray-600 dark:text-gray-400">เคยไปปีก่อน</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-400" />
                        <span className="text-gray-600 dark:text-gray-400">อยากไป</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span className="text-gray-600 dark:text-gray-400">ยังไม่เคยไป</span>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { key: 'all' as FilterType, label: 'ทั้งหมด', icon: <MapPinned className="w-4 h-4" /> },
                        { key: 'visited' as FilterType, label: 'เคยไป', icon: <Heart className="w-4 h-4" /> },
                        { key: 'wishlist' as FilterType, label: 'อยากไป', icon: <Star className="w-4 h-4" /> },
                        { key: 'not-visited' as FilterType, label: 'ยังไม่เคย', icon: <Filter className="w-4 h-4" /> },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key)}
                            className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${filter === item.key
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400'
                                }
              `}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <PaperCard className="p-3 sm:p-4 overflow-hidden">
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-2 sm:p-4 relative min-h-[500px]">
                                <ThailandMap
                                    selectedProvinceId={selectedProvince}
                                    onSelectProvince={(id) => setSelectedProvince(id === selectedProvince ? null : id)}
                                />

                                {/* Compass */}
                                <div className="absolute top-4 right-4 text-paper-400 dark:text-slate-600 text-xs font-bold pointer-events-none">
                                    <div className="flex flex-col items-center">
                                        <span>N</span>
                                        <div className="w-0.5 h-4 bg-current mt-1 flex items-start justify-center">
                                            <div className="w-1.5 h-1.5 rotate-45 border-t border-l border-current -mt-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PaperCard>
                    </div>

                    {/* Province Details Panel */}
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            {selectedProvinceData ? (
                                <motion.div
                                    key={selectedProvinceData.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <PaperCard className="p-5">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                                    {selectedProvinceData.nameTh}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {selectedProvinceData.nameEn}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {allVisitedProvinces.has(selectedProvinceData.id) ? (
                                                    <span className="px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500 text-[10px] font-medium">
                                                        ♥ เคยไปด้วยกัน
                                                    </span>
                                                ) : wishlistProvinces.has(selectedProvinceData.id) ? (
                                                    <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 text-[10px] font-medium">
                                                        ★ อยากไป
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-medium text-center">
                                                        ยังไม่เคยไป
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex gap-2 mb-6">
                                            {visitInfo ? (
                                                <button
                                                    onClick={handleRemoveVisit}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs font-medium"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    ลบบันทึก
                                                </button>
                                            ) : (
                                                <Link href={`/map/add?id=${selectedProvinceData.id}`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-500 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-xs font-medium">
                                                        <Heart className="w-3.5 h-3.5" />
                                                        ไปมาแล้ว
                                                    </button>
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleToggleWishlist}
                                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-xs font-medium ${wishlistProvinces.has(selectedProvinceData.id)
                                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                                        : 'bg-amber-50 dark:bg-amber-900/10 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/20'
                                                    }`}
                                            >
                                                <Star className={`w-3.5 h-3.5 ${wishlistProvinces.has(selectedProvinceData.id) ? 'fill-amber-500' : ''}`} />
                                                {wishlistProvinces.has(selectedProvinceData.id) ? 'อยู่ในลิสต์' : 'อยากไป'}
                                            </button>
                                        </div>

                                        {/* Region Badge */}
                                        <div className="mb-4">
                                            <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px]">
                                                ภาค{
                                                    selectedProvinceData.region === 'north' ? 'เหนือ' :
                                                        selectedProvinceData.region === 'northeast' ? 'ตะวันออกเฉียงเหนือ' :
                                                            selectedProvinceData.region === 'central' ? 'กลาง' :
                                                                selectedProvinceData.region === 'east' ? 'ตะวันออก' :
                                                                    selectedProvinceData.region === 'west' ? 'ตะวันตก' : 'ใต้'
                                                }
                                            </span>
                                        </div>

                                        {/* Visit Info */}
                                        {visitInfo && (
                                            <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 mb-4">
                                                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 text-sm mb-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(visitInfo.visitDate, 'long')}
                                                </div>
                                                {visitInfo.note && (
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                                                        {visitInfo.note}
                                                    </p>
                                                )}
                                                {/* Link to Yearbook */}
                                                <Link
                                                    href={`/yearbook/${new Date(visitInfo.visitDate).getMonth() + 1}`}
                                                    className="inline-flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:underline"
                                                >
                                                    <Calendar className="w-3 h-3" />
                                                    ดูใน Yearbook เดือน {new Date(visitInfo.visitDate).toLocaleDateString('th-TH', { month: 'long' })} →
                                                </Link>
                                            </div>
                                        )}

                                        {/* Related Moments */}
                                        {visitInfo?.relatedMomentIds && visitInfo.relatedMomentIds.length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">
                                                    ความทรงจำที่เกี่ยวข้อง
                                                </h4>
                                                <div className="space-y-2">
                                                    {visitInfo.relatedMomentIds.map(momentId => {
                                                        const moment = yearData?.moments.find(m => m.id === momentId);
                                                        if (!moment) return null;
                                                        return (
                                                            <Link key={momentId} href={`/museum/${momentId}`}>
                                                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                                                                    {moment.title}
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </PaperCard>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <PaperCard className="p-6 text-center">
                                        <MapPinned className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            คลิกที่จังหวัดบนแผนที่เพื่อดูรายละเอียด
                                        </p>
                                    </PaperCard>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Province List */}
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm">
                                {filter === 'visited' && `จังหวัดที่เคยไป (${filteredProvinces.length})`}
                                {filter === 'wishlist' && `จังหวัดที่อยากไป (${filteredProvinces.length})`}
                                {filter === 'not-visited' && `จังหวัดที่ยังไม่เคยไป (${filteredProvinces.length})`}
                                {filter === 'all' && `จังหวัดทั้งหมด (${filteredProvinces.length})`}
                            </h3>
                            <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                {filteredProvinces.slice(0, 20).map((province) => (
                                    <motion.button
                                        key={province.id}
                                        onClick={() => setSelectedProvince(province.id)}
                                        whileHover={{ x: 3 }}
                                        className={`
                      w-full flex items-center gap-2 p-2 rounded-xl text-left transition-colors text-sm
                      ${selectedProvince === province.id
                                                ? 'bg-pink-100 dark:bg-pink-900/30'
                                                : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
                                            }
                    `}
                                    >
                                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getProvinceColor(province)}`} />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-gray-800 dark:text-gray-100 truncate block text-sm">
                                                {province.nameTh}
                                            </span>
                                            {/* Show visit month if visited */}
                                            {yearData?.visitedProvinces?.find(vp => vp.provinceId === province.id) && (
                                                <span className="text-[10px] text-pink-500">
                                                    {new Date(yearData.visitedProvinces.find(vp => vp.provinceId === province.id)!.visitDate).toLocaleDateString('th-TH', { month: 'short', year: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        {allVisitedProvinces.has(province.id) && (
                                            <Heart className="w-3 h-3 text-pink-500 fill-pink-500 flex-shrink-0" />
                                        )}
                                        {wishlistProvinces.has(province.id) && !allVisitedProvinces.has(province.id) && (
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                                        )}
                                    </motion.button>
                                ))}
                                {filteredProvinces.length > 20 && (
                                    <p className="text-center text-xs text-gray-400 py-2">
                                        และอีก {filteredProvinces.length - 20} จังหวัด...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
