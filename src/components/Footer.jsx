import React from "react";
import Image from "next/image";
import logo from "@/assets/website-logo.png";

function Footer() {
  return (
    <div>
      <footer className="bg-blue-800 ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" class="flex items-center mb-4 sm:mb-0">
              <Image
                src={logo}
                className="h-8 w-8 mr-3 rounded-full shadow-md"
                alt="bettertrade.me logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-400">
                BetterTrade.me
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0">
              <li>
                <a href="/trading" className="mr-4 hover:underline md:mr-6 ">
                  Trade
                </a>
              </li>
              <li>
                <a
                  href="https://bettertrade-me.gitbook.io/untitled/"
                  className="mr-4 hover:underline md:mr-6"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="/invest" className="mr-4 hover:underline md:mr-6">
                  Invest(ICO)
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/ra4gsDKy7Z"
                  className="hover:underline"
                  target="_blank"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-400 sm:text-center">
            © 2023{" "}
            <a href="/" className="hover:underline">
              BetterTrade.me™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
