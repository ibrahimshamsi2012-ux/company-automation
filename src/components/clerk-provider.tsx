'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  if (!hasClerkKey) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
