'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { loadUniverseData, saveUniverseData, createNewUniverse, isSupabaseConfigured } from '@/lib/supabase';
import { UniverseData } from '@/types';

interface CloudSyncState {
    shareId: string | null;
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncedAt: Date | null;
    error: string | null;
}

const SHARE_ID_KEY = 'our-universe-share-id';

export function useCloudSync() {
    const { universeData, resetData } = useAppStore();
    const [syncState, setSyncState] = useState<CloudSyncState>({
        shareId: null,
        isOnline: false,
        isSyncing: false,
        lastSyncedAt: null,
        error: null,
    });

    // Load share ID from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedShareId = localStorage.getItem(SHARE_ID_KEY);
            const isConfigured = isSupabaseConfigured();
            setSyncState(prev => ({
                ...prev,
                shareId: savedShareId,
                isOnline: isConfigured
            }));
        }
    }, []);

    // Auto-sync when data changes
    useEffect(() => {
        if (!syncState.shareId || !syncState.isOnline) return;

        const timer = setTimeout(() => {
            saveToCloud();
        }, 5000); // 5 second debounce

        return () => clearTimeout(timer);
    }, [universeData, syncState.shareId, syncState.isOnline]);

    // Load data from cloud
    const loadFromCloud = useCallback(async (shareId: string) => {
        if (!isSupabaseConfigured()) {
            setSyncState(prev => ({ ...prev, error: 'Supabase not configured' }));
            return false;
        }

        setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

        try {
            const cloudData = await loadUniverseData(shareId);

            if (cloudData) {
                // Update store with cloud data
                useAppStore.setState({ universeData: cloudData as UniverseData });
                localStorage.setItem(SHARE_ID_KEY, shareId);
                setSyncState(prev => ({
                    ...prev,
                    shareId,
                    isSyncing: false,
                    lastSyncedAt: new Date()
                }));
                return true;
            } else {
                setSyncState(prev => ({
                    ...prev,
                    isSyncing: false,
                    error: 'ไม่พบข้อมูลจาก Share ID นี้'
                }));
                return false;
            }
        } catch (err) {
            setSyncState(prev => ({
                ...prev,
                isSyncing: false,
                error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
            }));
            return false;
        }
    }, []);

    // Save data to cloud
    const saveToCloud = useCallback(async () => {
        if (!isSupabaseConfigured() || !syncState.shareId) {
            return false;
        }

        setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

        try {
            const success = await saveUniverseData(syncState.shareId, universeData);

            if (success) {
                setSyncState(prev => ({
                    ...prev,
                    isSyncing: false,
                    lastSyncedAt: new Date()
                }));
                return true;
            } else {
                setSyncState(prev => ({
                    ...prev,
                    isSyncing: false,
                    error: 'บันทึกข้อมูลไม่สำเร็จ'
                }));
                return false;
            }
        } catch (err) {
            setSyncState(prev => ({
                ...prev,
                isSyncing: false,
                error: 'เกิดข้อผิดพลาดในการบันทึก'
            }));
            return false;
        }
    }, [syncState.shareId, universeData]);

    // Create new universe in cloud
    const createCloud = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setSyncState(prev => ({ ...prev, error: 'Supabase not configured' }));
            return null;
        }

        setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

        try {
            const newShareId = await createNewUniverse(universeData);

            if (newShareId) {
                localStorage.setItem(SHARE_ID_KEY, newShareId);
                setSyncState(prev => ({
                    ...prev,
                    shareId: newShareId,
                    isSyncing: false,
                    lastSyncedAt: new Date()
                }));
                return newShareId;
            } else {
                setSyncState(prev => ({
                    ...prev,
                    isSyncing: false,
                    error: 'สร้าง Universe ใหม่ไม่สำเร็จ'
                }));
                return null;
            }
        } catch (err) {
            setSyncState(prev => ({
                ...prev,
                isSyncing: false,
                error: 'เกิดข้อผิดพลาด'
            }));
            return null;
        }
    }, [universeData]);

    // Disconnect from cloud
    const disconnectCloud = useCallback(() => {
        localStorage.removeItem(SHARE_ID_KEY);
        setSyncState(prev => ({
            ...prev,
            shareId: null,
            lastSyncedAt: null,
            error: null
        }));
    }, []);

    // Set share ID manually (for joining existing universe)
    const setShareId = useCallback((id: string) => {
        localStorage.setItem(SHARE_ID_KEY, id);
        setSyncState(prev => ({ ...prev, shareId: id }));
    }, []);

    return {
        ...syncState,
        loadFromCloud,
        saveToCloud,
        createCloud,
        disconnectCloud,
        setShareId,
    };
}
