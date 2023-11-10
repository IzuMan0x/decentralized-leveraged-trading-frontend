"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Web3Button } from "@web3modal/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import logo from "@/assets/website-logo.png";
import HamburgerMenu from "@/components/HamburgerMenu";

import { useWindowSize } from "@/hooks/useWindowSize";

function NavBar() {
  const pathname = usePathname();
  const windowSize = useWindowSize();

  /*   //TODO complete this so we automatically request to change the user wallet network
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork(); */

  return (
    <nav className="bg-blue-700 border-gray-200 dark:bg-gray-900 rounded-b-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            className="h-8 w-8 mr-1 rounded-full shadow-md"
            alt="bettertrade.me logo"
          />
          <span className="self-center text-sm tracking-tighter font-semibold whitespace-nowrap text-white">
            BetterTrade.me
          </span>
        </Link>

        {windowSize.width > 900 ? (
          <>
            <div
              className="flex items-center justify-between w-full md:w-auto order-0"
              id="navbar-cta"
            >
              <ul className="flex flex-col font-medium p-2 md:p-2 mt-4 border  rounded-lg  md:flex-row space-x-4 md:mt-0 md:border-0  bg-gray-800 dark:bg-gray-900 border-gray-700">
                <li>
                  <Link
                    href="/trading"
                    className={`block p-0 rounded md:bg-transparent md:hover:text-blue-700  
                ${
                  pathname === "/trading"
                    ? "underline underline-offset-1 text-blue-500"
                    : "text-white"
                }`}
                  >
                    Trade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className={`block rounded md:bg-transparent md:hover:text-blue-700 p-0 
                ${
                  pathname === "/leaderboard"
                    ? "underline underline-offset-1 text-blue-500"
                    : "text-white"
                }`}
                  >
                    LeaderBoards
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://bettertrade-me.gitbook.io/untitled/"
                    className={`block  rounded md:bg-transparent md:hover:text-blue-700 p-0 
                ${
                  pathname === "/documentation"
                    ? "underline underline-offset-1 text-blue-500"
                    : "text-white"
                }`}
                    target="_blank"
                  >
                    Documentation
                  </Link>
                </li>

                <li>
                  <Link
                    href="/invest"
                    className={`block  rounded md:bg-transparent md:hover:text-blue-700 p-0 
                ${
                  pathname === "/invest"
                    ? "underline underline-offset-1 text-blue-500"
                    : "text-white"
                }`}
                  >
                    Invest (ICO)
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.gg/ra4gsDKy7Z"
                    target="_blank"
                    className={`block  rounded md:bg-transparent md:hover:text-blue-700 p-0 
                ${
                  pathname === "/contact"
                    ? "underline underline-offset-1 text-blue-500"
                    : "text-white"
                }`}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex m-2">
              <Web3Button />
            </div>
          </>
        ) : (
          <>
            <div className="flex mr-14">
              <Web3Button />
            </div>
            <div className="absolute right-1">
              <HamburgerMenu></HamburgerMenu>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
