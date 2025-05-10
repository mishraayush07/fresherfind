import { Inter } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/mobile/BottomNav';
import Navbar from '@/components/Navbar';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CityLiving - Find Your Perfect Accommodation',
  description: 'Find nearby hostels, PGs, flats, and mess services for students and newcomers.',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CityLiving',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <BottomNav />
       
      </body>
    </html>
  );
}
