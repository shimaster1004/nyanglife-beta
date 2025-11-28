import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getRedirectUrl(): string {
  // 1. Check for explicit environment variable (VITE_SITE_URL)
  const envUrl = (import.meta as any).env.VITE_SITE_URL;
  if (envUrl) return envUrl;

  // 2. Use window.location.origin if available (Client-side)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 3. Default fallback
  return 'http://localhost:5173';
}
