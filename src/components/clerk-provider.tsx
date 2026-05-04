'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const key = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').trim();
  
  // Robust validation for Clerk Publishable Key
  // 1. Must exist
  // 2. Must not be the placeholder string
  // 3. Must start with pk_test_ or pk_live_
  // 4. Must be long enough to be a valid key
  const hasKey = 
    key.length > 0 && 
    !key.includes('YOUR_') && 
    (key.startsWith('pk_test_') || key.startsWith('pk_live_')) &&
    key.length > 20;

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
