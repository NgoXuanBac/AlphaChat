import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/contexts/auth/AuthContext";

export const metadata: Metadata = {
  title: "Alpha Chat",
  description: ""
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        GeistSans.className,
        `${GeistSans.variable}`,
        "h-screen"
      )}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
