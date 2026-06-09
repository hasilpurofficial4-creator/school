// ============================================================
// useApi Hook
// Study Hub Lahore - Data fetching with loading/error states
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T = unknown>(
  url: string,
  deps: any[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await apiFetch<T>(url);

    if (result.success && result.data !== undefined) {
      setData(result.data);
    } else {
      setError(result.error || "Failed to fetch data");
    }

    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData };
}
