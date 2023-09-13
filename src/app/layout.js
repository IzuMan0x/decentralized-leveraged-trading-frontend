import "./globals.css";
import { Inter } from "next/font/google";
//import { Helmet } from "react-helmet";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BetterTrade.me",
  description: "Decentralized Leverage Trading",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
