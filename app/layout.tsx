import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Provoda",
  icon: "/logo.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`body { background-color: #2a2a2a; }`}</style>
        <link rel="icon" href={metadata.icon} type="image/x-icon"/>
      </head>
      <body className={font.className}>{children}</body>
    </html>
  );
}
