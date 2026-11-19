import { createAsyncStorage } from "@react-native-async-storage/async-storage/jest";

const storage = createAsyncStorage('metrotransit-app-cache');

interface CacheEntry<T> {
    data: T,
    expiresAt: number,
}

export const CacheService = {
    async set<T>(key: string, data: T, ttlMs = 60 * 60 * 1000): Promise<void> {
        const entry: CacheEntry<T> = {
            data,
            expiresAt: Date.now() + ttlMs,
        };

        await storage.setItem(key, JSON.stringify(entry));
    },

    async get<T>(key: string, allowExpired = false): Promise<T | null> {
        const value = await storage.getItem(key);

        if (value === null) {
            return null;
        }

        try {
            const entry = JSON.parse(value) as CacheEntry<T>;

            if (!allowExpired && Date.now() >= entry.expiresAt) {
                return null;
            }

            return entry.data;
        } catch {
            await storage.removeItem(key);
            return null;
        }
    },

    async remove(key: string): Promise<void> {
        await storage.removeItem(key);
    },

    async clear(): Promise<void> {
        await storage.clear();
    }
}