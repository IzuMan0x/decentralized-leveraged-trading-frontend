import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import logo from "../assets/website-logo.png";

function NavBar() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <nav className="bg-blue-700 border-gray-200 dark:bg-gray-900 rounded-b-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <Image
            src={logo}
            className="h-8 w-8 mr-3 rounded-full shadow-md"
            alt="bettertrade.me logo"
          />
          <span className=" text-white self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            BetterTrade.me
          </span>
        </a>
        <div className="flex md:order-2">
          <Web3Button />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-3 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/trading"
                className="block py-2 pl-3 pr-4 text-gray-900 bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="/trading"
              >
                Trade
              </a>
            </li>

            <li>
              <a
                href="https://bettertrade-me.gitbook.io/untitled/"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
                target="_blank"
              >
                Documentation
              </a>
            </li>

            <li>
              <a
                href="/invest"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Invest (ICO)
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/J6q62sQF"
                target="_blank"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
