"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Web3Button } from "@web3modal/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import logo from "../assets/website-logo.png";

function NavBar() {
  const pathname = usePathname();

  //TODO complete this so we automatically request to change the user wallet network
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <nav className="bg-blue-700 border-gray-200 dark:bg-gray-900 rounded-b-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            className="h-8 w-8 mr-3 rounded-full shadow-md"
            alt="bettertrade.me logo"
          />
          <span className=" text-white self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            BetterTrade.me
          </span>
        </Link>
        <div className="flex md:order-2 m-2">
          <Web3Button />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-3 mt-4 border  rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0  bg-gray-800 dark:bg-gray-900 border-gray-700">
            <li>
              <Link
                href="/trading"
                className={`block py-2 pl-3 pr-4 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 
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
                className={`block py-2 pl-3 pr-4 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 
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
                className={`block py-2 pl-3 pr-4 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 
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
                className={`block py-2 pl-3 pr-4 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 
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
                className={`block py-2 pl-3 pr-4 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 
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
      </div>
    </nav>
  );
}

export default NavBar;
