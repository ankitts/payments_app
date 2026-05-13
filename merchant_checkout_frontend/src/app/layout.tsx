import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AppChrome } from "@/components/AppChrome";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevStack Academy | Course Enrollment",
  description:
    "Enroll in a structured tech course bundle across web development, machine learning, cloud, data, and engineering workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <AppChrome>{children}</AppChrome>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
