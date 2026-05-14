'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';
import { hasValidClerkPublishableKey } from "@/lib/clerk";

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const key = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').trim();
  const hasKey = hasValidClerkPublishableKey(key);

  // Always render children, but only wrap with ClerkProvider on the client if the key is valid
  // This prevents the 'atob' error caused by malformed keys
  if (!isMounted || !hasKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={key}>
      {children}
    </ClerkProvider>
  );
}
