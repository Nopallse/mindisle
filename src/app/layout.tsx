import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDEN — AI Living World',
  description:
    'A persistent top-down pixel-art simulation inhabited by autonomous AI characters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}

