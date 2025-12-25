// css
import './index.css';

// libraries
import { StrictMode } from 'react';
import { PostHogProvider } from 'posthog-js/react';

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import router from '@/lib/router';
import { queryClient } from '@/lib/tanstack-query/client';
import { options } from '@/lib/posthog';
import AppErrorFallback from '@/lib/error-boundary';

import { POSTHOG_KEY } from '@/utils/env';

import NotificationProvider from '@/providers/NotificationProvider';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <PostHogProvider apiKey={POSTHOG_KEY} options={options}>
      <ErrorBoundary fallbackRender={AppErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </PostHogProvider>
  </StrictMode>
);
