'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'ค้นหา...'
}: SearchBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          w-full pl-10 pr-10 py-3 rounded-xl
          bg-white/80 dark:bg-slate-800/80
          backdrop-blur-sm
          border border-gray-200 dark:border-gray-700
          text-gray-800 dark:text-gray-200
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-rose-500/50
          transition-all
        "
            />

            {value && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </motion.button>
            )}
        </motion.div>
    );
}
