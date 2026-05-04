'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasKey = key && !key.includes('YOUR_') && key.length > 0;

  // Always render children, but only wrap with ClerkProvider on the client if the key exists
  if (!isMounted || !hasKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={key}>
      {children}
    </ClerkProvider>
  );
}
