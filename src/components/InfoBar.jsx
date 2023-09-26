"use client";
import React, { useEffect, useState } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import TotalLongs from "./TotalLongs";
import TotalShorts from "./TotalShorts";
import TotalLongsBorrowFee from "./TotalLongsBorrowFee";
import TotalShortsBorrowFee from "./TotalShortsBorrowFee";

function InfoBar(props) {
  const mounted = useIsMounted();
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("");
  useEffect(() => {
    setSelectedAssetIndex(props.assetSelectIndex);
    setSelectedAssetSymbol(props.assetSelectSymbol);
  }, [props.assetSelectIndex, props.assetSelectSymbol]);

  return (
    <div>
      {mounted && (
        <nav className="bg-gray-700 border-gray-200 dark:bg-gray-900 rounded-lg m-2 md:shrink-0">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center">
              <span className=" text-white self-center text-l font-semibold whitespace-nowrap dark:text-white">
                {`Current Trading Details for Pair: ${selectedAssetSymbol}`}
              </span>
            </div>
            <div className="flex md:order-2"></div>
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 text-xs"
              id="navbar-cta"
            >
              <ul className="flex flex-col flex-wrap font-medium p-4 md:p-3 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <div class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-green-700 md:p-0 md:dark:text-green-600 hover:text-green-400">
                    <TotalLongs pairIndex={selectedAssetIndex}></TotalLongs>
                  </div>
                </li>

                <li>
                  <div
                    className="block py-2 pl-3 pr-4 text-red-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-500 md:p-0 md:dark:hover:text-red-500 dark:text-red-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    <TotalShorts pairIndex={selectedAssetIndex} />
                  </div>
                </li>

                <li>
                  <div className="block py-2 pl-2 pr-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    <TotalLongsBorrowFee pairIndex={selectedAssetIndex} />
                  </div>
                </li>
                <li>
                  <div className="block py-2 pl-2 pr-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    <TotalShortsBorrowFee pairIndex={selectedAssetIndex} />
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
