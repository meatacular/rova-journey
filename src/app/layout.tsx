import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "rova journey",
  description: "Your personalised audio journey for the commute",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${lexend.variable} font-sans antialiased`}>
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
