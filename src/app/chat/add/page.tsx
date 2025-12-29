'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Save, MessageCircle, Plus, Trash2, Send } from 'lucide-react';
import Link from 'next/link';

export default function AddChatEpisodePage() {
    const router = useRouter();
    const { addChatEpisode, selectedYear } = useAppStore();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [messages, setMessages] = useState<{ from: 'me' | 'you'; text: string; time: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [newMsgFrom, setNewMsgFrom] = useState<'me' | 'you'>('me');

    const handleAddMessage = () => {
        if (!newMessage.trim()) return;

        const time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        setMessages([...messages, { from: newMsgFrom, text: newMessage.trim(), time }]);
        setNewMessage('');
    };

    const handleRemoveMessage = (index: number) => {
        setMessages(messages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || messages.length === 0) {
            alert('ช่วยใส่ชื่อตอนและเพิ่มข้อความอย่างน้อย 1 ข้อความหน่อยน้า');
            return;
        }

        const newEpisode = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            description: description.trim(),
            messages
        };

        addChatEpisode(selectedYear, newEpisode);
        router.push('/chat');
    };

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/chat">
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
                            <MessageCircle className="w-6 h-6 text-pink-500" />
                            เพิ่มแชทตอนใหม่
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            บันทึกบทสนทนาที่น่ารักของเราไว้
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PaperCard className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ชื่อตอน
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all font-serif"
                                placeholder="เช่น เมื่อคืนคุยกันเรื่องอะไรนะ..."
                                required
                            />
                        </div>

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

                        {/* Message List Preview */}
                        <div className="space-y-2 max-h-60 overflow-y-auto p-4 bg-paper-50 dark:bg-slate-900/50 rounded-2xl border border-paper-200 dark:border-slate-800">
                            {messages.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 py-4 italic">ยังไม่มีข้อความจ้า...</p>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} group items-start gap-2`}>
                                        {msg.from === 'you' && <button type="button" onClick={() => handleRemoveMessage(idx)} className="opacity-0 group-hover:opacity-100 text-red-500 p-1"><Trash2 className="w-3 h-3" /></button>}
                                        <div className={`
                                            max-w-[80%] px-3 py-1.5 rounded-2xl text-sm shadow-sm
                                            ${msg.from === 'me' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-paper-200 dark:border-slate-700 rounded-tl-none'}
                                        `}>
                                            {msg.text}
                                            <div className={`text-[8px] mt-1 opacity-70 ${msg.from === 'me' ? 'text-white/80 text-right' : 'text-gray-400'}`}>
                                                {msg.time}
                                            </div>
                                        </div>
                                        {msg.from === 'me' && <button type="button" onClick={() => handleRemoveMessage(idx)} className="opacity-0 group-hover:opacity-100 text-red-500 p-1"><Trash2 className="w-3 h-3" /></button>}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Message Form */}
                        <div className="space-y-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-paper-200 dark:border-slate-700">
                            <div className="flex gap-2 p-1 bg-paper-100 dark:bg-slate-900 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setNewMsgFrom('me')}
                                    className={`flex-1 py-1 px-3 rounded-md text-xs font-medium transition-all ${newMsgFrom === 'me' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    เรา (Me)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewMsgFrom('you')}
                                    className={`flex-1 py-1 px-3 rounded-md text-xs font-medium transition-all ${newMsgFrom === 'you' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    เธอ (You)
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMessage())}
                                    className="flex-1 px-4 py-2 rounded-xl bg-paper-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    placeholder="พิมพ์ข้อความ..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMessage}
                                    className="p-2.5 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-500 hover:bg-pink-200 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
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
                        บันทึกแชทตอนเอกพจน์
                    </motion.button>
                </form>
            </main>
        </div>
    );
}
