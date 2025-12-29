'use client';

import { useAppStore } from '@/lib/store';
import { getAvailableYears } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function YearSwitcher() {
    const { universeData, selectedYear, setSelectedYear } = useAppStore();
    const years = getAvailableYears(universeData);

    return (
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
            {years.map((year) => (
                <motion.button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${selectedYear === year
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/20'
                        }
          `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {year}
                </motion.button>
            ))}
        </div>
    );
}
