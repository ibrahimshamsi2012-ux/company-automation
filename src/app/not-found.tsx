import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold font-jakarta">Neural Path Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The coordinate you requested does not exist in our automation grid. 
          Please return to the hub or check your credentials.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Hub</span>
        </Link>
      </div>
    </div>
  );
}
