"use client";
import React from "react";
import { useAccount, useContractRead } from "wagmi";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import orderBookAbi from "@/assets/OrderBook.json";
import { formatUnits } from "viem";
import { PriceTicker } from "@/components/PythPriceText";
import MOCKCloseLimitOrder from "@/components/mock-development/MOCKCloseLimitOrder";
import { useIsMounted } from "@/hooks/useIsMounted";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

function MOCKOpenLimitOrders() {
  //This hook is to prevent the hydration error
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();
  ////////////////////
  // Contract Reads//
  ///////////////////
  //currently need to reload the page to get the open trades to show up
  const assetArray = [0, 1, 2, 3, 4];
  const assetSymbolArray = [
    "ETH/USD",
    "BTC/USD",
    "XRP/USD",
    "MATIC/USD",
    "BNB/USD",
  ];
  const longShortSymbolArray = ["Long", "Short"];
  // This is return and array of size 15 that will include all the user's open limit orders
  const {
    data: allUserOpenLimitOrders,
    error: allUserOpenLimitOrdersError,
    isError: allUserOpenLimitOrdersIsError,
    isLoading: allUserOpenTradesIsLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getAllUserLimitOrders",
    args: [address],
    watch: true,
    onSuccess(data) {
      console.log("Success on getting user open trades: ", data);
    },
  });
  console.log("all user limit orders are: ", allUserOpenLimitOrders);

  return (
    <div className="overflow-x-auto">
      <h1 className="text-white flex justify-center">Open Limit Orders</h1>

      <div className="relative shadow-md">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Asset Pair
              </th>
              <th scope="col" className="px-6 py-3">
                Long/Short
              </th>
              <th scope="col" className="px-6 py-3">
                Target Price
              </th>
              <th scope="col" className="px-6 py-3">
                Current Price
              </th>

              <th scope="col" className="px-6 py-3">
                Close Limit Order
              </th>
            </tr>
          </thead>

          {mounted && !allUserOpenLimitOrdersIsError
            ? allUserOpenLimitOrders &&
              allUserOpenLimitOrders.map((userLimitOrderDetails, index) => {
                const pairIndex = userLimitOrderDetails.pairIndex;
                const userTradeIdForPair = index % 3;
                if (userLimitOrderDetails.leverage != 0) {
                  return (
                    <tbody key={`pair-${pairIndex}-trade${userTradeIdForPair}`}>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {userLimitOrderDetails
                            ? assetSymbolArray[userLimitOrderDetails.pairIndex]
                            : "loading..."}
                        </th>
                        <td
                          className={`px-6 py-4 ${
                            userLimitOrderDetails.orderType == 0
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {
                            longShortSymbolArray[
                              userLimitOrderDetails.orderType
                            ]
                          }
                        </td>
                        <td className="px-6 py-4">
                          $
                          {userLimitOrderDetails
                            ? formatUnits(userLimitOrderDetails.targetPrice, 8)
                            : "loading..."}
                        </td>
                        <td className="px-6 py-4">
                          <PriceTicker
                            pairIndex={userLimitOrderDetails?.pairIndex}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <MOCKCloseLimitOrder
                            id={userTradeIdForPair}
                            value={pairIndex}
                          />
                        </td>
                      </tr>
                    </tbody>
                  );
                }
              })
            : null}
        </table>
      </div>
    </div>
  );
}

export default MOCKOpenLimitOrders;
