"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import cryingCat from "../assets/cryingcat.png";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractReads,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import orderBookAbi from "../assets/OrderBook.json";
import { parseEther, formatUnits } from "viem";
import { useIsMounted } from "@/hooks/useIsMounted";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

function InfoBar(props) {
  const mounted = useIsMounted();
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("");

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...orderBook,
        functionName: "getTotalLongAmount",
        args: [selectedAssetIndex],
        watch: true,
      },
      {
        ...orderBook,
        functionName: "getTotalShortAmount",
        args: [selectedAssetIndex],
        watch: true,
      },
      {
        ...orderBook,
        functionName: "getCurrentBorrowRate",
        args: [selectedAssetIndex],
        watch: true,
      },
      {
        ...orderBook,
        functionName: "getBaseBorrowFee",
        args: [selectedAssetIndex],
      },
    ],
  });
  useEffect(() => {
    setSelectedAssetIndex(props.assetSelectIndex);
    setSelectedAssetSymbol(props.assetSelectSymbol);
  }, [props.assetSelectIndex, props.assetSelectSymbol]);

  console.log("getTotalLongAmount", data);
  console.log("loading contract data: ", isError);

  return (
    <div>
      {mounted && !isLoading && !isError && (
        <nav className="bg-gray-700 border-gray-200 dark:bg-gray-900 rounded-lg my-1 mx-6">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center">
              <span className=" text-white self-center text-l font-semibold whitespace-nowrap dark:text-white">
                {`Current Trading Details: ${selectedAssetSymbol}`}
              </span>
            </div>
            <div class="flex md:order-2"></div>
            <div
              class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 text-xs"
              id="navbar-cta"
            >
              <ul className="flex flex-col flex-wrap font-medium p-4 md:p-3 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <div
                    class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-green-700 md:p-0 md:dark:text-green-600 hover:text-green-400"
                    aria-current="/trading"
                  >
                    {`Total Longs: ${
                      data[0]?.result == undefined
                        ? 0
                        : formatUnits(data[0].result, 18)
                    }`}
                  </div>
                </li>

                <li>
                  <div
                    class="block py-2 pl-3 pr-4 text-red-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-500 md:p-0 md:dark:hover:text-red-500 dark:text-red-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    {`Total Shorts: ${
                      data[1]?.result == undefined
                        ? 0
                        : formatUnits(data[1]?.result, 18)
                    }`}
                  </div>
                </li>

                <li>
                  <div className="block py-2 pl-2 pr-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    {`Longs Borrow Fee: ${
                      data[2].result == undefined ||
                      data[3]?.result == undefined
                        ? "loading... "
                        : formatUnits?.(data[2]?.result, 7) +
                          formatUnits?.(data[3]?.result, 7)
                    }/hour`}
                  </div>
                </li>
                <li>
                  <div className="block py-2 pl-2 pr-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    {`Shorts Borrow Fee: ${
                      data[2].result == undefined ||
                      data[3]?.result == undefined
                        ? "loading... "
                        : formatUnits?.(data[2]?.result, 7) +
                          formatUnits?.(data[3]?.result, 7)
                    }/hour`}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default InfoBar;
