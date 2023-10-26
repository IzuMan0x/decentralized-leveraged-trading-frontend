import "./globals.css";
import { Inter } from "next/font/google";
import logo from "../assets/website-logo.png";

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

      <body className={inter.className}>
        <h1>YO this is here</h1>
        {children}
      </body>
    </html>
  );
}
