'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { VisitedDistrict } from '@/types';
import { thaiProvinces } from '@/data/thai-provinces';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { ArrowLeft, MapPin, Calendar, Save, Trash2, Camera, Plus, History, Heart } from 'lucide-react';

export default function DistrictDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string; // format: provinceId-districtName (decoded)
    const decodedId = decodeURIComponent(id);
    const [provinceId, ...districtNameParts] = decodedId.split('-');
    const districtName = districtNameParts.join('-');

    const { universeData, selectedYear, addVisitedDistrict, updateVisitedDistrict, removeVisitedDistrict } = useAppStore();
    const yearData = universeData.years[selectedYear];
    const province = thaiProvinces.find(p => p.id === provinceId);

    const existingRecord = useMemo(() =>
        yearData?.visitedDistricts?.find(d => d.id === decodedId),
        [yearData, decodedId]);

    const [note, setNote] = useState(existingRecord?.note || '');
    const [visitDate, setVisitDate] = useState(existingRecord?.visitDate || new Date().toISOString().split('T')[0]);
    const [photos, setPhotos] = useState<string[]>(existingRecord?.photos || []);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (existingRecord) {
            setNote(existingRecord.note || '');
            setVisitDate(existingRecord.visitDate || new Date().toISOString().split('T')[0]);
            setPhotos(existingRecord.photos || []);
        }
    }, [existingRecord]);

    const handleSave = () => {
        setIsSaving(true);
        const data: VisitedDistrict = {
            id: decodedId,
            districtName,
            provinceId,
            visitDate,
            note,
            photos
        };

        if (existingRecord) {
            updateVisitedDistrict(selectedYear, decodedId, data);
        } else {
            addVisitedDistrict(selectedYear, data);
        }

        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleDelete = () => {
        if (confirm('ลบข้อมูลการไปเยือนอำเภอนี้ใช่ไหม?')) {
            removeVisitedDistrict(selectedYear, decodedId);
            router.back();
        }
    };

    const addPhoto = () => {
        if (newPhotoUrl.trim()) {
            setPhotos([...photos, newPhotoUrl.trim()]);
            setNewPhotoUrl('');
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen pb-20">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Navigation & Header */}
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/80 border border-gray-100 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            <span className="text-xs font-bold text-pink-500 tracking-wider uppercase">District Memory</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">อำเภอ{districtName}</h1>
                        <p className="text-sm text-gray-500 font-medium">จังหวัด{province?.nameTh}</p>
                    </div>
                    {existingRecord && (
                        <button
                            onClick={handleDelete}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Recording Status */}
                    <AnimatePresence>
                        {saveSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 rounded-2xl bg-green-50 text-green-600 text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <Heart className="w-4 h-4 fill-green-500" />
                                บันทึกความจำอำเภอนี้แล้วจ้า!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Section */}
                    <PaperCard className="p-6">
                        <div className="space-y-6">
                            {/* Date */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    วันที่ไปเยือน
                                </label>
                                <input
                                    type="date"
                                    value={visitDate}
                                    onChange={(e) => setVisitDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-paper-50 border-2 border-transparent focus:border-pink-200 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                />
                            </div>

                            {/* Note */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    <History className="w-3.5 h-3.5" />
                                    จดบันทึกเกี่ยวกับที่นี่
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="มีอะไรพิเศษที่อำเภอนี้ไหมนะ..."
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-2xl bg-paper-50 border-2 border-transparent focus:border-pink-200 focus:bg-white outline-none transition-all font-medium text-gray-700 resize-none"
                                />
                            </div>

                            {/* Photos */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    <Camera className="w-3.5 h-3.5" />
                                    รูปภาพความทรงจำ
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="วางลิงก์รูปภาพ..."
                                            value={newPhotoUrl}
                                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                                            className="flex-1 px-4 py-2 text-sm rounded-xl bg-paper-50 border-2 border-transparent focus:border-pink-200 outline-none"
                                        />
                                        <button
                                            onClick={addPhoto}
                                            className="px-4 py-2 rounded-xl bg-pink-100 text-pink-500 font-bold text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {photos.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            {photos.map((url, idx) => (
                                                <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden shadow-sm">
                                                    <img src={url} alt={`District Memory ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removePhoto(idx)}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'กำลังบันทึก...' : 'บันทึกความทรงจำ'}
                            </button>
                        </div>
                    </PaperCard>
                </div>
            </main>
        </div>
    );
}
