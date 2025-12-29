'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useAppStore();
    const isCozy = theme === 'cozy';

    return (
        <motion.button
            onClick={toggleTheme}
            className={`
        relative w-14 h-8 rounded-full p-1 transition-colors duration-300
        ${isCozy
                    ? 'bg-gradient-to-r from-amber-200 to-orange-200'
                    : 'bg-gradient-to-r from-indigo-800 to-purple-900'
                }
      `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${isCozy ? 'bg-amber-500' : 'bg-indigo-400'}
        `}
                animate={{ x: isCozy ? 0 : 24 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {isCozy ? (
                    <Sun className="w-4 h-4 text-white" />
                ) : (
                    <Moon className="w-4 h-4 text-white" />
                )}
            </motion.div>
        </motion.button>
    );
}
