import React from "react";
import Link from "next/link";
import { Web3Button } from "@web3modal/react";

function NavBar() {
  return (
    <div className="w-screen-full rounded-b-md">
      <header className="w-full absolute z-10 bg-slate-800 rounded-xl">
        <nav className="max-w-1440px mx-auto flex justify-between justify-right sm:px-16 px-6 py-4 bg-transparent">
          <Link
            href="/trading"
            className="flex justify-center items-center text-white"
          >
            <h1>zkTrading</h1>
          </Link>
          <Link href="/vault" className="flex justify-center items-center">
            <h1 className="text-white">Vault</h1>
          </Link>
          <Web3Button></Web3Button>
        </nav>
      </header>
    </div>
  );
}

export default NavBar;
