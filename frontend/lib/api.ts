// EcoSense client API interface
// Single point of contact for the backend FastAPI service

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.trim() === '') {
    throw new Error(
      'NEXT_PUBLIC_API_URL is missing. Please define NEXT_PUBLIC_API_URL in your environment variables (e.g. https://ecosense-backend.onrender.com or http://localhost:8000 for local development).'
    );
  }
  return url.replace(/\/+$/, '');
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    source: string;
    data_status?: string;
    years?: string;
    downloaded?: string;
    simulated?: boolean;
    generated_at?: string;
  };
}

type WakingListener = (isWaking: boolean) => void;
const wakingListeners = new Set<WakingListener>();

export function subscribeServerWaking(listener: WakingListener): () => void {
  wakingListeners.add(listener);
  return () => {
    wakingListeners.delete(listener);
  };
}

export function notifyServerWaking(isWaking: boolean) {
  wakingListeners.forEach((fn) => {
    try {
      fn(isWaking);
    } catch {
      // ignore listener error
    }
  });
}

/**
 * Fetch wrapper calling FastAPI backend via NEXT_PUBLIC_API_URL.
 * Supports Render free-tier cold start handling: 20s timeout and 1 automatic retry
 * with notification to skeleton loaders.
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  onWakingChange?: (isWaking: boolean) => void
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const setWaking = (waking: boolean) => {
    notifyServerWaking(waking);
    if (onWakingChange) onWakingChange(waking);
  };

  const executeFetch = async (timeoutMs: number): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    // Attempt 1: 20 second timeout
    const res = await executeFetch(20000);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    setWaking(false);
    return await res.json();
  } catch (initialError: any) {
    // Server might be sleeping on Render free tier: notify and retry once
    setWaking(true);
    try {
      // Retry attempt 2: 20 second timeout
      const retryRes = await executeFetch(20000);
      if (!retryRes.ok) {
        throw new Error(`API error on retry: ${retryRes.status} ${retryRes.statusText}`);
      }
      return await retryRes.json();
    } finally {
      setWaking(false);
    }
  }
}
