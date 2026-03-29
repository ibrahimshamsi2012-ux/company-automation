import React from "react";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Shield, Lock, Eye, Globe, ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030712] text-white p-8 md:p-24 font-jakarta">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-12 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Home</span>
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Privacy Protocol
          </h1>
          <p className="text-gray-500 text-lg">Last Updated: March 29, 2026</p>
        </header>

        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-blue-500">
              <Shield size={24} />
              <h2 className="text-2xl font-bold">Data Sovereignty</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              At AI Automate, we believe your data is your property. Our neural engines process your emails and tasks in a siloed, encrypted environment. We do not sell, trade, or expose your private company data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-purple-500">
              <Lock size={24} />
              <h2 className="text-2xl font-bold">Encryption Standards</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              All communications between your device and our servers are protected by AES-256 military-grade encryption. Meeting streams are end-to-end encrypted (E2EE) using the WebRTC protocol via LiveKit.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-500">
              <Eye size={24} />
              <h2 className="text-2xl font-bold">AI Processing Transparency</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Our AI models (GPT-4 and TTS) only access the specific context you provide for each task. We do not use your private company data to train our global models. Your inputs remain within your enterprise instance.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-indigo-500">
              <Globe size={24} />
              <h2 className="text-2xl font-bold">Third-Party Integrations</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              When you connect your Gmail or Stripe accounts, we only request the minimum permissions necessary to function. You can revoke these permissions at any time through your account settings or via Clerk.
            </p>
          </section>

          <footer className="pt-24 border-t border-white/5 text-center">
            <p className="text-gray-600 text-sm">
              &copy; 2026 AI Automate. All rights reserved. Professional Grade Privacy.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
