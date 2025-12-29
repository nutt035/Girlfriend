import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UniverseData, Theme, Entry, Quest, Moment, VisitedProvince, CountdownEvent, ChatEpisode } from '@/types';
import universeJson from '@/data/universe.json';

interface AppState {
    // Data
    universeData: UniverseData;

    // UI State
    selectedYear: string;
    theme: Theme;
    searchQuery: string;
    selectedTags: string[];

    // Actions
    setSelectedYear: (year: string) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedTags: (tags: string[]) => void;
    toggleTag: (tag: string) => void;

    // Entry mutations
    addEntry: (year: string, entry: Entry) => void;
    updateEntry: (year: string, entryId: string, updates: Partial<Entry>) => void;
    deleteEntry: (year: string, entryId: string) => void;

    // Quest mutations
    addQuest: (year: string, quest: Quest) => void;
    updateQuestStatus: (year: string, questId: string, status: Quest['status']) => void;
    updateQuest: (year: string, questId: string, updates: Partial<Quest>) => void;
    deleteQuest: (year: string, questId: string) => void;

    // Moment mutations
    addMoment: (year: string, moment: Moment) => void;
    updateMoment: (year: string, momentId: string, updates: Partial<Moment>) => void;
    deleteMoment: (year: string, momentId: string) => void;

    // Province mutations
    addVisitedProvince: (year: string, province: VisitedProvince) => void;
    updateVisitedProvince: (year: string, provinceId: string, updates: Partial<VisitedProvince>) => void;
    removeVisitedProvince: (year: string, provinceId: string) => void;
    addWishlistProvince: (provinceId: string) => void;
    removeWishlistProvince: (provinceId: string) => void;

    // Countdown mutations
    addCountdown: (countdown: CountdownEvent) => void;
    updateCountdown: (countdownId: string, updates: Partial<CountdownEvent>) => void;
    deleteCountdown: (countdownId: string) => void;

    // Chat mutations
    addChatEpisode: (year: string, episode: ChatEpisode) => void;
    updateChatEpisode: (year: string, episodeId: string, updates: Partial<ChatEpisode>) => void;
    deleteChatEpisode: (year: string, episodeId: string) => void;

    // Meta mutations
    updateUniverseMeta: (updates: Partial<UniverseData['meta']>) => void;

    // Utils
    resetData: () => void;
    reloadFromJson: () => void;
}

const initialData = universeJson as unknown as UniverseData;

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial state
            universeData: initialData,
            selectedYear: '2025',
            theme: 'cozy',
            searchQuery: '',
            selectedTags: [],

            // UI Actions
            setSelectedYear: (year) => set({ selectedYear: year }),
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'cozy' ? 'midnight' : 'cozy'
            })),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setSelectedTags: (tags) => set({ selectedTags: tags }),
            toggleTag: (tag) => set((state) => ({
                selectedTags: state.selectedTags.includes(tag)
                    ? state.selectedTags.filter(t => t !== tag)
                    : [...state.selectedTags, tag]
            })),

            // Entry mutations
            addEntry: (year, entry) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, entries: [...yearData.entries, entry] }
                        }
                    }
                };
            }),

            updateEntry: (year, entryId, updates) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                entries: yearData.entries.map(e => e.id === entryId ? { ...e, ...updates } : e)
                            }
                        }
                    }
                };
            }),

            deleteEntry: (year, entryId) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, entries: yearData.entries.filter(e => e.id !== entryId) }
                        }
                    }
                };
            }),

            // Quest mutations
            addQuest: (year, quest) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, quests: [...yearData.quests, quest] }
                        }
                    }
                };
            }),

            updateQuestStatus: (year, questId, status) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                quests: yearData.quests.map(q =>
                                    q.id === questId
                                        ? { ...q, status, completedDate: status === 'done' ? new Date().toISOString().split('T')[0] : q.completedDate }
                                        : q
                                )
                            }
                        }
                    }
                };
            }),

            updateQuest: (year, questId, updates) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                quests: yearData.quests.map(q => q.id === questId ? { ...q, ...updates } : q)
                            }
                        }
                    }
                };
            }),

            deleteQuest: (year, questId) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, quests: yearData.quests.filter(q => q.id !== questId) }
                        }
                    }
                };
            }),

            addMoment: (year, moment) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, moments: [...yearData.moments, moment] }
                        }
                    }
                };
            }),

            updateMoment: (year, momentId, updates) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                moments: yearData.moments.map(m => m.id === momentId ? { ...m, ...updates } : m)
                            }
                        }
                    }
                };
            }),

            deleteMoment: (year, momentId) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, moments: yearData.moments.filter(m => m.id !== momentId) }
                        }
                    }
                };
            }),

            // Province mutations
            addVisitedProvince: (year, province) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                const existing = yearData.visitedProvinces || [];
                if (existing.some(p => p.provinceId === province.provinceId)) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, visitedProvinces: [...existing, province] }
                        }
                    }
                };
            }),

            updateVisitedProvince: (year, provinceId, updates) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                visitedProvinces: (yearData.visitedProvinces || []).map(p =>
                                    p.provinceId === provinceId ? { ...p, ...updates } : p
                                )
                            }
                        }
                    }
                };
            }),

            removeVisitedProvince: (year, provinceId) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, visitedProvinces: (yearData.visitedProvinces || []).filter(p => p.provinceId !== provinceId) }
                        }
                    }
                };
            }),

            addWishlistProvince: (provinceId) => set((state) => {
                const existing = state.universeData.wishlistProvinces || [];
                if (existing.includes(provinceId)) return state;
                return {
                    universeData: { ...state.universeData, wishlistProvinces: [...existing, provinceId] }
                };
            }),

            removeWishlistProvince: (provinceId) => set((state) => ({
                universeData: {
                    ...state.universeData,
                    wishlistProvinces: (state.universeData.wishlistProvinces || []).filter(p => p !== provinceId)
                }
            })),

            // Countdown mutations
            addCountdown: (countdown) => set((state) => ({
                universeData: {
                    ...state.universeData,
                    countdowns: [...(state.universeData.countdowns || []), countdown]
                }
            })),

            updateCountdown: (countdownId, updates) => set((state) => ({
                universeData: {
                    ...state.universeData,
                    countdowns: (state.universeData.countdowns || []).map(c =>
                        c.id === countdownId ? { ...c, ...updates } : c
                    )
                }
            })),

            deleteCountdown: (countdownId) => set((state) => ({
                universeData: {
                    ...state.universeData,
                    countdowns: (state.universeData.countdowns || []).filter(c => c.id !== countdownId)
                }
            })),

            // Chat mutations
            addChatEpisode: (year, episode) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, chatEpisodes: [...yearData.chatEpisodes, episode] }
                        }
                    }
                };
            }),

            updateChatEpisode: (year, episodeId, updates) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: {
                                ...yearData,
                                chatEpisodes: yearData.chatEpisodes.map(e => e.id === episodeId ? { ...e, ...updates } : e)
                            }
                        }
                    }
                };
            }),

            deleteChatEpisode: (year, episodeId) => set((state) => {
                const yearData = state.universeData.years[year];
                if (!yearData) return state;
                return {
                    universeData: {
                        ...state.universeData,
                        years: {
                            ...state.universeData.years,
                            [year]: { ...yearData, chatEpisodes: yearData.chatEpisodes.filter(e => e.id !== episodeId) }
                        }
                    }
                };
            }),

            updateUniverseMeta: (updates) => set((state) => ({
                universeData: {
                    ...state.universeData,
                    meta: { ...state.universeData.meta, ...updates }
                }
            })),

            // Utils
            resetData: () => set({ universeData: initialData }),
            reloadFromJson: () => set({ universeData: initialData }),
        }),
        {
            name: 'our-universe-storage',
            partialize: (state) => ({
                universeData: state.universeData,
                selectedYear: state.selectedYear,
                theme: state.theme,
            }),
        }
    )
);

// Selector hooks
export const useSelectedYear = () => useAppStore((state) => state.selectedYear);
export const useTheme = () => useAppStore((state) => state.theme);
export const useUniverseData = () => useAppStore((state) => state.universeData);

export const useYearData = () => {
    const universeData = useAppStore((state) => state.universeData);
    const selectedYear = useAppStore((state) => state.selectedYear);
    return universeData.years[selectedYear] || null;
};
