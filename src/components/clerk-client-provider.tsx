"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkClientProvider({ children, hasClerkKey }: { children: React.ReactNode, hasClerkKey: boolean }) {
  if (!hasClerkKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
