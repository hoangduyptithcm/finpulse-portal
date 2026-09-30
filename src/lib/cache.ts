interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Executes fetcher with in-memory caching for specified TTL (seconds).
 * Reduces roundtrips to remote database for read-heavy public routes.
 */
export async function withMemoryCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return existing.data;
  }

  const fresh = await fetcher();

  // Never cache null or undefined results to avoid false 404s persisting
  if (fresh !== null && fresh !== undefined) {
    memoryCache.set(key, {
      data: fresh,
      expiresAt: now + ttlSeconds * 1000,
    });
  }

  return fresh;
}

/**
 * Invalidate in-memory cache by key prefix (or all if omitted).
 */
export function invalidateMemoryCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}
