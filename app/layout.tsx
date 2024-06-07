import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Provoda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`body { background-color: #2a2a2a; }`}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
