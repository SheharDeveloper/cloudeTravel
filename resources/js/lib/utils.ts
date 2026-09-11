import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * True when a date (e.g. a passport/visa expiry date) falls within the next
 * `months` (default 6) — used to surface "expiring soon" warnings on
 * passport/visa fields across the admin.
 */
export function isExpiringSoon(dateStr: string | null | undefined, months: number = 6): boolean {
    if (!dateStr) return false;

    const expiry = new Date(dateStr);
    if (isNaN(expiry.getTime())) return false;

    const threshold = new Date();
    threshold.setMonth(threshold.getMonth() + months);

    return expiry <= threshold;
}
