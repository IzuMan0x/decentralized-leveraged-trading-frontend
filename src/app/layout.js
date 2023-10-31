import "./globals.css";
import { Inter } from "next/font/google";
import logo from "../assets/website-logo.png";
import { WalletConfigWrapper } from "@/components/WalletConfigWrapper";

const inter = Inter({ subsets: ["latin"] });

//This was introducted in the App router
//This can also be generated dynamicallly with the generateMetaData hook, check out the docs
export const metadata = {
  title: "BetterTrade.me",
  description: "Decentralized Leverage Trading",
  icon: logo,
};

//The rootlayour replaced the _app.js and _document.js in the page router. This app uses the next js app  router

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
        <WalletConfigWrapper>{children}</WalletConfigWrapper>
      </body>
    </html>
  );
}
