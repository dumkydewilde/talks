// Minimal no-op stub for @motherduck/react-sql-query.
// This deck doesn't query real data — just activates the runtime with SELECT 1.
// For data-driven Dives, swap this for the full shim from get_dive_guide.

export function useSQLQuery(_sql: string) {
  return {
    data: undefined,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isPlaceholderData: false,
    error: null,
    refetch: () => {},
    exportAs: async () => {},
    status: "success" as const,
  };
}

export function useExport() {
  return { exportQuery: async () => {} };
}

export function useDiveState<T>(_key: string, initial: T): [T, (v: T) => void] {
  // Minimal stub - state doesn't persist to URL in preview, but works for rendering.
  // (Not used by this deck, but kept for API parity.)
  let value = initial;
  return [value, (v: T) => { value = v; }];
}

export function useConnectionStatus() {
  return { isConnected: true, isConnecting: false, error: null };
}
