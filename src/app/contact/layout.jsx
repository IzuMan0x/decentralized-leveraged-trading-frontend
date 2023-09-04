import { Inter } from "next/font/google";
import { WalletConfigWrapper } from "../../components/WalletConfigWrapper";
import Contact from "./page";

const inter = Inter({ subsets: ["latin"] });

/* export const metadata = {
  title: "BetterTrade.me",
  description: "Decentralized Leverage Trading",
}; */

export default function ContactLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConfigWrapper>{children}</WalletConfigWrapper>
      </body>
    </html>
  );
}
