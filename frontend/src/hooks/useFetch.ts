import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions<T> {
  fetcher: () => Promise<T>;
  auto?: boolean;
}

export function useFetch<T>({ fetcher, auto = true }: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(auto);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  }, [fetcher]);

  useEffect(() => {
    if (auto) {
      // ✅ Retarder l'exécution pour éviter le warning de React
      const timer = setTimeout(() => {
        execute();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [execute, auto]);

  return { data, loading, error, execute, setData };
}
