'use client';

import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import GameMenuButtons from '@/components/GameMenuButtons';
import RandomMemoryCard from '@/components/RandomMemoryCard';
import CountdownWidget from '@/components/CountdownWidget';
import LoveStats from '@/components/LoveStats';
import PaperCard from '@/components/PaperCard';
import { useAppStore } from '@/lib/store';
import { computeDaysTogether, computeMoodAverage, getTopMoment, getMoodEmoji } from '@/lib/utils';
import { Heart, Sparkles, TrendingUp, Gamepad2 } from 'lucide-react';

export default function Home() {
  const { universeData, selectedYear } = useAppStore();
  const yearData = universeData.years[selectedYear];

  const daysTogether = computeDaysTogether(universeData.meta.relationshipStartDate);
  const moodAverage = yearData ? computeMoodAverage(yearData.entries) : 0;
  const topMoment = yearData ? getTopMoment(yearData.moments) : null;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-3"
          >
            <div className="text-5xl sm:text-6xl animate-float">💕</div>
          </motion.div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {universeData.meta.people.me} & {universeData.meta.people.you}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
            จักรวาลแห่งความทรงจำของเรา
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Days Together */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaperCard className="p-4 sm:p-5 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Days Together</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                {daysTogether.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                วัน และนับต่อไป...
              </p>
            </PaperCard>
          </motion.div>

          {/* Top Moment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PaperCard className="p-4 sm:p-5 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Top Moment {selectedYear}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
                {topMoment?.title || 'ยังไม่มีข้อมูล'}
              </div>
              {topMoment && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(topMoment.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </PaperCard>
          </motion.div>

          {/* Mood Average */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PaperCard className="p-4 sm:p-5 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Mood Average</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{getMoodEmoji(moodAverage)}</span>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {moodAverage || '-'}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">/ 10</p>
                </div>
              </div>
            </PaperCard>
          </motion.div>
        </div>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-rose-500" />
            เลือกโหมด
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            สำรวจจักรวาลของเราในมุมต่างๆ
          </p>
        </motion.div>

        {/* Game Menu Buttons */}
        <section className="mb-8">
          <GameMenuButtons />
        </section>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Love Stats - Shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="order-2 sm:order-1 sm:col-span-2 lg:col-span-2"
          >
            <LoveStats />
          </motion.div>

          {/* Countdown Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="order-1 sm:order-2"
          >
            <CountdownWidget />
          </motion.div>
        </div>

        {/* Random Memory Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-lg mx-auto"
        >
          <RandomMemoryCard />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-10 sm:mt-16 pb-6 sm:pb-8"
        >
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            Made with 💕 for us
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
