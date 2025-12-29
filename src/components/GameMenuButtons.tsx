'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon, BookOpen, Calendar, Landmark, Map, MessageCircle, Sword, Settings } from 'lucide-react';

interface MenuButton {
    href: string;
    label: string;
    sublabel: string;
    icon: LucideIcon;
    gradient: string;
    delay: number;
}

const menuButtons: MenuButton[] = [
    {
        href: '/journal',
        label: 'Journal',
        sublabel: 'บันทึกประจำวัน',
        icon: BookOpen,
        gradient: 'from-amber-500 to-orange-500',
        delay: 0
    },
    {
        href: '/yearbook',
        label: 'Yearbook',
        sublabel: 'ปฏิทินความทรงจำ',
        icon: Calendar,
        gradient: 'from-emerald-500 to-teal-500',
        delay: 0.05
    },
    {
        href: '/museum',
        label: 'Museum',
        sublabel: 'นิทรรศการความรัก',
        icon: Landmark,
        gradient: 'from-violet-500 to-purple-500',
        delay: 0.1
    },
    {
        href: '/map',
        label: 'Map',
        sublabel: 'แผนที่ของเรา',
        icon: Map,
        gradient: 'from-sky-500 to-blue-500',
        delay: 0.15
    },
    {
        href: '/chat',
        label: 'Chatlog',
        sublabel: 'บทสนทนาน่ารัก',
        icon: MessageCircle,
        gradient: 'from-pink-500 to-rose-500',
        delay: 0.2
    },
    {
        href: '/quests',
        label: 'Quest Log',
        sublabel: 'ภารกิจคู่รัก',
        icon: Sword,
        gradient: 'from-red-500 to-orange-500',
        delay: 0.25
    },
    {
        href: '/settings',
        label: 'Settings',
        sublabel: 'ตั้งค่า/จัดการข้อมูล',
        icon: Settings,
        gradient: 'from-gray-500 to-slate-600',
        delay: 0.3
    }
];


export default function GameMenuButtons() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {menuButtons.map((button) => {
                const Icon = button.icon;

                return (
                    <motion.div
                        key={button.href}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: button.delay, type: 'spring', stiffness: 200 }}
                    >
                        <Link href={button.href}>
                            <motion.div
                                className={`
                                    relative p-4 sm:p-6 rounded-xl sm:rounded-2xl overflow-hidden
                                    bg-gradient-to-br ${button.gradient}
                                    shadow-lg sm:shadow-xl cursor-pointer
                                    group min-h-[120px] sm:min-h-[140px]
                                    active:scale-95 transition-transform
                                `}
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* Background decoration */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute -right-6 -bottom-6 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white/30" />
                                    <div className="absolute -left-3 -top-3 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/20" />
                                </div>

                                {/* Icon */}
                                <div className="relative mb-2 sm:mb-4">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="relative">
                                    <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1">
                                        {button.label}
                                    </h3>
                                    <p className="text-white/80 text-xs sm:text-sm line-clamp-1">
                                        {button.sublabel}
                                    </p>
                                </div>

                                {/* Arrow indicator for mobile */}
                                <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}

