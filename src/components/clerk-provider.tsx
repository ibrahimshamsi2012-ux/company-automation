'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_');

  if (!hasClerkKey) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
