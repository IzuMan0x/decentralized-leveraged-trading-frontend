import { Inter } from "next/font/google";
import { WalletConfigWrapper } from "../../components/WalletConfigWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function ContactLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConfigWrapper>{children}</WalletConfigWrapper>
      </body>
    </html>
  );
}
