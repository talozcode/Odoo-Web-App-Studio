"use client";

import { useSyncExternalStore } from "react";

function describe(fetchedAt: string, nowSeconds: number): string {
  const seconds = Math.max(0, nowSeconds - Math.round(new Date(fetchedAt).getTime() / 1000));
  if (seconds < 60) return `synced ${seconds} s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `synced ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `synced ${hours} h ago`;
  return `synced ${Math.round(hours / 24)} d ago`;
}

// A one-second clock as an external store: the server snapshot is null so
// the markup hydrates identically however long the page sat in the cache.
let tick = Math.round(Date.now() / 1000);
function subscribe(onChange: () => void) {
  const id = window.setInterval(() => {
    tick = Math.round(Date.now() / 1000);
    onChange();
  }, 1000);
  return () => window.clearInterval(id);
}
const getSnapshot = () => tick;
const getServerSnapshot = () => null;

export function SyncedAgo({ fetchedAt }: { fetchedAt: string }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (now === null) return <span aria-hidden="true">synced</span>;
  return <span>{describe(fetchedAt, now)}</span>;
}
