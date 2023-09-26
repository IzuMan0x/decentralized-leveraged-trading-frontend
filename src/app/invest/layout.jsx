import { Inter } from "next/font/google";
import { WalletConfigWrapper } from "../../components/WalletConfigWrapper";
import logo from "../../assets/website-logo.png";
import Contact from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BetterTrade.me",
  description: "Decentralized Leverage Trading",
  icon: logo,
};

export default function InvestLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConfigWrapper>{children}</WalletConfigWrapper>
      </body>
    </html>
  );
}
