import "./globals.css";
import { Inter } from "next/font/google";
import logo from "../assets/website-logo.png";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
//import { Helmet } from "react-helmet";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BetterTrade.me",
  description: "Decentralized Leverage Trading",
  icon: logo,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Need to put the website logo here */}
        <link
          rel="icon"
          href="/icon?<generated"
          type="image/<generated>"
          sizes="<generated>"
        ></link>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
