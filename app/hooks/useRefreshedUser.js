"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export function useRefreshedUser(triggerRefresh = false) {
  const { user, isLoading, error } = useUser();
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!triggerRefresh || hasRefreshed) return;

    setHasRefreshed(true);
    setRefreshing(true);

    window.location.href = `/api/auth/login?prompt=none&returnTo=${encodeURIComponent(
      window.location.pathname
    )}`;
  }, [triggerRefresh, hasRefreshed]);

  return {
    user,
    isLoading,
    error,
    refreshing,
  };
}
