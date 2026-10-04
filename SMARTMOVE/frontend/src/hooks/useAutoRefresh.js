import { useEffect } from "react";

export default function useAutoRefresh(callback, interval = 10000, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    callback();
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval, enabled]);
}
