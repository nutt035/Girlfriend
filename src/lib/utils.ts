import {
    UniverseData,
    YearData,
    Entry,
    Moment,
    RandomMemoryItem,
    Badge,
    MonthlyHighlight
} from '@/types';

/**
 * Get data for a specific year
 */
export function getSelectedYearData(data: UniverseData, year: string): YearData | null {
    return data.years[year] || null;
}

/**
 * Calculate days together from relationship start date
 */
export function computeDaysTogether(relationshipStartDate: string): number {
    const startDate = new Date(relationshipStartDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Calculate average mood from entries
 */
export function computeMoodAverage(entries: Entry[]): number {
    if (entries.length === 0) return 0;
    const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
    return Math.round((totalMood / entries.length) * 10) / 10;
}

/**
 * Get top moment (isTopMoment=true or highest score)
 */
export function getTopMoment(moments: Moment[]): Moment | null {
    if (moments.length === 0) return null;

    // First, try to find a moment marked as top
    const topMoment = moments.find(m => m.isTopMoment);
    if (topMoment) return topMoment;

    // Otherwise, find the one with highest score
    return moments.reduce((best, current) => {
        const currentScore = current.score || 0;
        const bestScore = best.score || 0;
        return currentScore > bestScore ? current : best;
    }, moments[0]);
}

/**
 * Build timeline from entries and moments, sorted by date descending
 */
export function buildTimeline(entries: Entry[], moments: Moment[]): (Entry | Moment)[] {
    const combined = [
        ...entries.map(e => ({ ...e, _type: 'entry' as const })),
        ...moments.map(m => ({ ...m, _type: 'moment' as const }))
    ];

    return combined.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/**
 * Get a random memory (entry, moment, photo, or note)
 */
export function randomMemory(data: UniverseData, selectedYear?: string): RandomMemoryItem | null {
    const years = selectedYear ? [selectedYear] : Object.keys(data.years);
    const allItems: RandomMemoryItem[] = [];

    years.forEach(year => {
        const yearData = data.years[year];
        if (!yearData) return;

        yearData.entries.forEach(entry => {
            allItems.push({ type: 'entry', data: entry, route: `/journal/${entry.id}` });
        });

        yearData.moments.forEach(moment => {
            allItems.push({ type: 'moment', data: moment, route: `/museum/${moment.id}` });
        });

        yearData.photos.forEach(photo => {
            allItems.push({ type: 'photo', data: photo, route: `/yearbook/${photo.month}` });
        });

        yearData.notes.forEach(note => {
            allItems.push({ type: 'note', data: note, route: `/journal` });
        });
    });

    if (allItems.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * allItems.length);
    return allItems[randomIndex];
}

/**
 * Get monthly highlights for yearbook
 */
export function getMonthlyHighlights(yearData: YearData, year: string): MonthlyHighlight[] {
    const months: MonthlyHighlight[] = [];

    for (let month = 1; month <= 12; month++) {
        const monthEntries = yearData.entries.filter(e => {
            const entryMonth = new Date(e.date).getMonth() + 1;
            return entryMonth === month;
        });

        const monthMoments = yearData.moments.filter(m => {
            const momentMonth = new Date(m.date).getMonth() + 1;
            return momentMonth === month;
        });

        const monthPhotos = yearData.photos.filter(p => p.month === month);

        months.push({
            month,
            year,
            entries: monthEntries,
            moments: monthMoments,
            photos: monthPhotos
        });
    }

    return months;
}

/**
 * Get all unique tags from entries
 */
export function getAllTags(entries: Entry[]): string[] {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
        entry.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}

/**
 * Filter entries by search query and tags
 */
export function filterEntries(
    entries: Entry[],
    searchQuery: string,
    selectedTags: string[]
): Entry[] {
    return entries.filter(entry => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase());

        // Tag filter
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => entry.tags.includes(tag));

        return matchesSearch && matchesTags;
    });
}

/**
 * Check if a badge should be unlocked
 */
export function checkBadgeUnlock(badge: Badge, data: UniverseData): boolean {
    const years = Object.values(data.years);
    const doneQuests = years.flatMap(y => y.quests).filter(q => q.status === 'done');
    const totalEntries = years.reduce((sum, y) => sum + y.entries.length, 0);
    const totalPhotos = years.reduce((sum, y) => sum + y.photos.length, 0);
    const totalVisitedProvinces = new Set(years.flatMap(y => (y.visitedProvinces || []).map(p => p.provinceId))).size;
    const totalVisitedDistricts = years.reduce((sum, y) => sum + (y.visitedDistricts || []).length, 0);

    const condition = badge.condition;
    const targetCount = condition.count || 0;

    switch (condition.type) {
        case 'first_quest':
            return doneQuests.length >= 1;

        case 'quest_count':
            return doneQuests.length >= targetCount;

        case 'quest_tag':
            const taggedQuests = doneQuests.filter(q =>
                q.tags.includes(condition.tag || '')
            );
            return taggedQuests.length >= targetCount;

        case 'province_count' as any:
            return totalVisitedProvinces >= targetCount;

        case 'district_count' as any:
            return totalVisitedDistricts >= targetCount;

        case 'entry_count' as any:
            return totalEntries >= targetCount;

        case 'photo_count' as any:
            return totalPhotos >= targetCount;

        default:
            return false;
    }
}

/**
 * Get quest progress for a year
 */
export function getQuestProgress(yearData: YearData): { done: number; total: number; percentage: number } {
    const total = yearData.quests.length;
    const done = yearData.quests.filter(q => q.status === 'done').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return { done, total, percentage };
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
    const date = new Date(dateString);

    if (format === 'long') {
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return date.toLocaleDateString('th-TH', {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get mood emoji from number
 */
export function getMoodEmoji(mood: number): string {
    if (mood >= 9) return '🥰';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '🙂';
    if (mood >= 3) return '😐';
    return '😢';
}

/**
 * Get month name in Thai
 */
export function getMonthName(month: number): string {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return months[month - 1] || '';
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get available years from data
 */
export function getAvailableYears(data: UniverseData): string[] {
    return Object.keys(data.years).sort();
}
