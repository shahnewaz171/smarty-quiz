import { POSTHOG_HOST } from '@/utils/env';

export const options = {
  api_host: POSTHOG_HOST,
  defaults: '2025-05-24'
} as const;
