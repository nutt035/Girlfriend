'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/supabase';
import { ImageIcon, X, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = 'รูปภาพ' }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้นนะ');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('รูปใหญ่เกินไปนิดนึง (ไม่เกิน 5MB นะคะ)');
            return;
        }

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            if (url) {
                onChange(url);
            } else {
                alert('อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกทีนะ');
            }
        } catch (error) {
            console.error('Upload component error:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="relative group">
                <AnimatePresence mode="wait">
                    {value ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 border-2 border-dashed border-paper-300 dark:border-slate-700"
                        >
                            <img
                                src={value}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="upload"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full aspect-video rounded-2xl border-2 border-dashed border-paper-300 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500 transition-colors flex flex-col items-center justify-center gap-2 bg-paper-50 dark:bg-slate-900/50 group"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                                    <span className="text-sm text-gray-500">กำลังอัปโหลด...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-500 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">คลิกเพื่ออัปโหลดรูปภาพ</span>
                                        <p className="text-[10px] text-gray-400 mt-1">ไฟล์ JPG, PNG หรือ GIF (สูงสุด 5MB)</p>
                                    </div>
                                </>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
}
