'use client';

import { Montserrat } from 'next/font/google';
import "./globals.css";
import { MigrationProvider } from '../context/MigrationContext';
import MigrationNotification from '../components/MigrationNotification';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
});

// Metadata harus dipindahkan ke file terpisah karena 'use client'
// metadata.ts atau metadata.js di folder yang sama

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <title>Mobile Legends Tournament Bracket - IKMATIF 11</title>
        <meta name="description" content="Tournament bracket for Mobile Legends competition at IKMATIF 11 event." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MigrationProvider>
          {children}
          <MigrationNotification />
        </MigrationProvider>
      </body>
    </html>
  );
} 