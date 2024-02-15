import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { AppConfig } from '@/utils/AppConfig';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves the path to an asset url corresponding to the current environment.
 *
 * In development, this will return a relative path to the asset in local.
 * In production, this will return an url to the asset in the CDN.
 *
 * @param assetName The name of the asset to resolve.
 * @param modifiers Optional modifiers to apply to the asset, this will only apply to CDN assets.
 * @returns The resolved path to the asset.
 */
export function dal(assetName: string, modifiers: Record<string, string> = {}) {
  let useCdn = process.env.NODE_ENV === 'production';

  if (assetName.endsWith('.gif')) {
    // NOTE: processing of gifs is only supported by Premium plans
    useCdn = false;
  }

  if (!useCdn) {
    return `/assets/${assetName}`;
  }

  const params = new URLSearchParams(modifiers);

  return `${AppConfig.assetCdn}/assets/${assetName}?${params.toString()}`;
}
