import { SafeClerkProvider } from '@/components/clerk-provider';
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/loading-screen";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-[#030712] text-white font-sans antialiased",
        inter.variable,
        jakarta.variable
      )}>
        <SafeClerkProvider>
          {children}
        </SafeClerkProvider>
      </body>
    </html>
  );
}
