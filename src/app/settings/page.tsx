'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { useCloudSync } from '@/hooks/useCloudSync';
import { ArrowLeft, Settings, RefreshCw, Trash2, Database, AlertTriangle, Check, Cloud, CloudOff, Share2, Copy, User, Heart, Calendar as CalendarIcon, Save, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
    const { universeData, selectedYear, reloadFromJson, resetData, deleteQuest, deleteMoment, deleteCountdown, updateUniverseMeta } = useAppStore();
    const yearData = universeData.years[selectedYear];

    // Meta State
    const [metaData, setMetaData] = useState(universeData.meta);
    const [isEditingMeta, setIsEditingMeta] = useState(false);
    const [saveMetaSuccess, setSaveMetaSuccess] = useState(false);

    const [showReloadConfirm, setShowReloadConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [reloadSuccess, setReloadSuccess] = useState(false);
    const [inputShareId, setInputShareId] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const {
        shareId,
        isOnline,
        isSyncing,
        lastSyncedAt,
        error: syncError,
        loadFromCloud,
        saveToCloud,
        createCloud,
        disconnectCloud
    } = useCloudSync();

    const handleReload = () => {
        reloadFromJson();
        setShowReloadConfirm(false);
        setReloadSuccess(true);
        setTimeout(() => setReloadSuccess(false), 3000);
    };

    const handleReset = () => {
        resetData();
        setShowResetConfirm(false);
        window.location.reload();
    };

    const handleSaveMeta = () => {
        updateUniverseMeta(metaData);
        setIsEditingMeta(false);
        setSaveMetaSuccess(true);
        setTimeout(() => setSaveMetaSuccess(false), 3000);
    };

    const handleCopyShareId = () => {
        if (shareId) {
            navigator.clipboard.writeText(shareId);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
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
                            <Settings className="w-6 h-6 text-gray-500" />
                            ตั้งค่า
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">จัดการข้อมูลและการตั้งค่า</p>
                    </div>
                </div>

                {/* Success Messages */}
                {reloadSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-2 text-sm"
                    >
                        <Check className="w-5 h-5" />
                        โหลดข้อมูลจาก universe.json สำเร็จ!
                    </motion.div>
                )}
                {saveMetaSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-2 text-sm"
                    >
                        <Heart className="w-5 h-5 fill-green-500" />
                        บันทึกข้อมูลส่วนตัวเรียบร้อยแล้วจ้า!
                    </motion.div>
                )}

                {/* Profile Meta Section */}
                <PaperCard className="p-4 sm:p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-pink-500" />
                            ข้อมูล Universe ของเรา
                        </h2>
                        <button
                            onClick={() => setIsEditingMeta(!isEditingMeta)}
                            className="text-pink-500 text-sm font-medium hover:underline"
                        >
                            {isEditingMeta ? 'ยกเลิก' : 'แก้ไข'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isEditingMeta ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">ชื่อ Universe</label>
                                    <input
                                        type="text"
                                        value={metaData.appName}
                                        onChange={(e) => setMetaData({ ...metaData, appName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">ชื่อของฉัน (Me)</label>
                                        <input
                                            type="text"
                                            value={metaData.people.me}
                                            onChange={(e) => setMetaData({ ...metaData, people: { ...metaData.people, me: e.target.value } })}
                                            className="w-full px-3 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">ชื่อของเธอ (You)</label>
                                        <input
                                            type="text"
                                            value={metaData.people.you}
                                            onChange={(e) => setMetaData({ ...metaData, people: { ...metaData.people, you: e.target.value } })}
                                            className="w-full px-3 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">วันที่เริ่มคบกัน</label>
                                    <input
                                        type="date"
                                        value={metaData.relationshipStartDate}
                                        onChange={(e) => setMetaData({ ...metaData, relationshipStartDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveMeta}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Universe Name</p>
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{universeData.meta.appName}</p>
                                    </div>
                                    <Heart className="w-5 h-5 text-gray-200" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-pink-900/10">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Me</p>
                                        <p className="font-medium text-pink-600 dark:text-pink-400">{universeData.meta.people.me}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">You</p>
                                        <p className="font-medium text-indigo-600 dark:text-indigo-400">{universeData.meta.people.you}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10">
                                    <CalendarIcon className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Start Date</p>
                                        <p className="font-medium text-amber-700 dark:text-amber-400">{universeData.meta.relationshipStartDate}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </PaperCard>

                {/* Cloud Sync Section */}
                <PaperCard className="p-4 sm:p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Cloud className={`w-5 h-5 ${shareId ? 'text-blue-500' : 'text-gray-400'}`} />
                            Cloud Sync (ซิงค์ข้ามเครื่อง)
                        </h2>
                        {shareId ? (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-green-500 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                เชื่อมต่อแล้ว
                            </span>
                        ) : (
                            <span className="text-[10px] sm:text-xs text-gray-400">ยังไม่ได้เชื่อมต่อ</span>
                        )}
                    </div>

                    {!isOnline ? (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-700 dark:text-amber-400 mb-3">
                            <AlertTriangle className="w-4 h-4 inline mr-2 mb-1" />
                            ยังไม่ได้ตั้งค่า Supabase ในระบบ กรุณาติดต่อผู้พัฒนา
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!shareId ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">สำหรับผู้ใช้ใหม่</p>
                                        <button
                                            onClick={createCloud}
                                            disabled={isSyncing}
                                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Cloud className="w-4 h-4" />
                                            สร้าง Universe ใหม่
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">สำหรับเชื่อมต่อเครื่องอื่น</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="ใส่ Share ID"
                                                value={inputShareId}
                                                onChange={(e) => setInputShareId(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <button
                                                onClick={() => loadFromCloud(inputShareId.trim())}
                                                disabled={isSyncing || !inputShareId.trim()}
                                                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold disabled:opacity-50"
                                            >
                                                จอย
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Your Share ID</span>
                                            <button
                                                onClick={handleCopyShareId}
                                                className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs font-bold"
                                            >
                                                {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {copySuccess ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 font-mono text-center text-lg tracking-wider text-gray-800 dark:text-gray-100">
                                                {shareId}
                                            </div>
                                            <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-tight">
                                            ส่งรหัสนี้ให้อีกฝ่ายเพื่อซิงค์ข้อมูลพร้อมกัน
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveToCloud}
                                            disabled={isSyncing}
                                            className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                            {isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลตอนนี้'}
                                        </button>
                                        <button
                                            onClick={disconnectCloud}
                                            disabled={isSyncing}
                                            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm font-medium flex items-center justify-center gap-2"
                                            title="Disconnect"
                                        >
                                            <CloudOff className="w-4 h-4" />
                                            ตัดการเชื่อมต่อ
                                        </button>
                                    </div>

                                    {lastSyncedAt && (
                                        <p className="text-[10px] text-gray-400 text-center">
                                            Last synced: {lastSyncedAt.toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {syncError && (
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs text-center font-medium">
                                    {syncError}
                                </div>
                            )}
                        </div>
                    )}
                </PaperCard>

                {/* Data Management */}
                <PaperCard className="p-4 sm:p-6 mb-6">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-500" />
                        จัดการข้อมูล
                    </h2>

                    <div className="space-y-3">
                        {/* Reload from JSON */}
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">โหลดข้อมูลจาก JSON</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        อัพเดทข้อมูลจากไฟล์ universe.json (ข้อมูลที่เพิ่มใหม่จะหายไป)
                                    </p>
                                </div>
                                {!showReloadConfirm ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowReloadConfirm(true)}
                                        className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reload
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowReloadConfirm(false)}
                                            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            onClick={handleReload}
                                            className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium"
                                        >
                                            ยืนยัน
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Wipe Everything (Clean Slate) */}
                        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1 text-orange-600">
                                        <Trash2 className="w-4 h-4" />
                                        ล้างข้อมูลเพื่อเริ่มใหม่ (Clean Slate)
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        ลบข้อมูลทั้งหมดและเริ่มจาก Universe ที่ว่างเปล่า (ข้อมูลของเราเอง)
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (confirm("ต้องการล้างข้อมูลทั้งหมดเพื่อเริ่มจดใหม่ใช่ไหม? (ข้อมูลตัวอย่างจะหายไปด้วยนะ)")) {
                                            useAppStore.getState().clearAllData();
                                            window.location.href = '/';
                                        }
                                    }}
                                    className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium flex items-center gap-1"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Wipe
                                </motion.button>
                            </div>
                        </div>

                        {/* Reset All Data (Restore JSON) */}
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        กู้ข้อมูลตั้งต้น (Reset to Default)
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        ลบข้อมูลปัจจุบันและโหลดกลับมาจากไฟล์ตัวอย่าง
                                    </p>
                                </div>
                                {!showResetConfirm ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowResetConfirm(true)}
                                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Reset
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowResetConfirm(false)}
                                            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
                                        >
                                            ยืนยัน
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </PaperCard>

                {/* Data Stats */}
                <PaperCard className="p-4 sm:p-6 mb-6">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">สรุปข้อมูล (ปี {selectedYear})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Journal', count: yearData?.entries.length || 0 },
                            { label: 'Moments', count: yearData?.moments.length || 0 },
                            { label: 'Quests', count: yearData?.quests.length || 0 },
                            { label: 'Chat', count: yearData?.chatEpisodes.length || 0 },
                        ].map(item => (
                            <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{item.count}</div>
                                <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </PaperCard>

                {/* Quests List with Delete */}
                {yearData?.quests.length > 0 && (
                    <PaperCard className="p-4 sm:p-6 mb-6">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">จัดการ Quests</h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {yearData.quests.map(quest => (
                                <div key={quest.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <span className="text-sm text-gray-800 dark:text-gray-100 truncate">{quest.title}</span>
                                    <button
                                        onClick={() => deleteQuest(selectedYear, quest.id)}
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </PaperCard>
                )}

                {/* Moments List with Delete */}
                {yearData?.moments.length > 0 && (
                    <PaperCard className="p-4 sm:p-6 mb-6">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-pink-500" />
                            จัดการ Museum Moments
                        </h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {yearData.moments.map(moment => (
                                <div key={moment.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 truncate flex-1 mr-2">
                                        {moment.image && <img src={moment.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
                                        <span className="text-sm text-gray-800 dark:text-gray-100 truncate">{moment.title}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteMoment(selectedYear, moment.id)}
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </PaperCard>
                )}

                {/* Countdowns List with Delete */}
                {(universeData.countdowns?.length ?? 0) > 0 && (
                    <PaperCard className="p-4 sm:p-6 mb-6">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">จัดการ Countdowns</h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {(universeData.countdowns ?? []).map(countdown => (
                                <div key={countdown.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{countdown.icon}</span>
                                        <span className="text-sm text-gray-800 dark:text-gray-100">{countdown.title}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteCountdown(countdown.id)}
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </PaperCard>
                )}

                {/* Info */}
                <div className="text-center text-xs text-gray-400 dark:text-gray-500">
                    <p>ข้อมูลถูกเก็บใน localStorage ของ browser นี้</p>
                    <p>ถ้าล้าง cache หรือเปลี่ยนเครื่องข้อมูลจะไม่ sync</p>
                </div>
            </main>
        </div>
    );
}
