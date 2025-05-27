import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto py-4 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <Image 
              src="/images/infoikamtif 11.png" 
              alt="Logo IKMATIF"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center">
            <Image 
              src="/images/logo-mobile-legend-31251.png" 
              alt="Mobile Legends Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
            <div className="ml-3">
              <h1 className="text-xl md:text-2xl font-bold text-white">Tournament Bracket</h1>
              <p className="text-blue-400 text-sm">28 Mei 2025</p>
            </div>
          </div>
        </div>
        
        <nav className="flex space-x-2">
          <Link href="/" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition">
            Beranda
          </Link>
          <Link href="/bracket-a" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition">
            Bracket A
          </Link>
          <Link href="/bracket-b" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition">
            Bracket B
          </Link>
          <Link href="/finals" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md transition">
            Final
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 