import { SafeClerkProvider } from '@/components/clerk-provider';
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

export const metadata: Metadata = {
  title: "AI Automate | Professional Company Automation",
  description: "Scale your company operations with AI-powered email management, task automation, and virtual meetings.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Build-time safety check for Clerk key
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_');

  return (
    <SafeClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={cn(
          "min-h-screen bg-[#030712] text-white font-sans antialiased",
          inter.variable,
          jakarta.variable
        )}>
          <div className="relative flex min-h-screen flex-col">
            {/* Subtle Background Glows */}
            <div className="fixed top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
            <div className="fixed top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
            <div className="fixed -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
            
            <main className="flex-1 relative z-10">{children}</main>
          </div>
        </body>
      </html>
    </SafeClerkProvider>
  );
}
