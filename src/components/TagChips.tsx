'use client';

import { motion } from 'framer-motion';

interface TagChipsProps {
    tags: string[];
    selectedTags?: string[];
    onTagClick?: (tag: string) => void;
    size?: 'sm' | 'md';
}

export default function TagChips({
    tags,
    selectedTags = [],
    onTagClick,
    size = 'sm'
}: TagChipsProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1'
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => {
                const isSelected = selectedTags.includes(tag);

                return (
                    <motion.button
                        key={tag}
                        onClick={() => onTagClick?.(tag)}
                        disabled={!onTagClick}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={onTagClick ? { scale: 1.1 } : undefined}
                        whileTap={onTagClick ? { scale: 0.95 } : undefined}
                        className={`
              ${sizeClasses[size]}
              rounded-full font-medium transition-all
              ${isSelected
                                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                            }
              ${onTagClick ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
            `}
                    >
                        #{tag}
                    </motion.button>
                );
            })}
        </div>
    );
}
