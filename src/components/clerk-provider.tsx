'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasKey = key && !key.includes('YOUR_') && key.length > 0;

  if (!hasKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={key}>
      {children}
    </ClerkProvider>
  );
}
