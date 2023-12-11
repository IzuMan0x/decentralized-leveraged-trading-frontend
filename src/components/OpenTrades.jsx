"use client";
import React, { useEffect, useState } from "react";
import {
  EvmPriceServiceConnection,
  HexString,
  Price,
  PriceFeed,
} from "@pythnetwork/pyth-evm-js";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useContractReads,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import orderBookAbi from "@/assets/OrderBook.json";
import mockPythContractAbi from "@/assets/mock-pyth-abi.json";
import { abi as pythnetworkAbi } from "@/assets/pythnetwork-abi.json";
import { parseEther, formatUnits } from "viem";
import { PriceTicker } from "@/components/PythPriceText";
import CloseTrade from "@/components/CloseTrade";
import PositionPnl from "@/components/PositionPnl";
import { useIsMounted } from "@/hooks/useIsMounted";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

function OpenTrades() {
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
  // This is return and array of size 15 that will include all the user's open trades
  const {
    data: allUserOpenTrades,
    error: allUserOpenTradesError,
    isError: allUserOpenTradesIsError,
    isLoading: allUserOpenTradesIsLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getAllUserOpenTrades",
    args: [address],
    watch: true,
    onSuccess(data) {
      console.log("Success on getting user open trades: ", data);
    },
  });
  console.log("all user trades are: ", allUserOpenTrades);

  ///////////////////////
  //Testing Features////
  //////////////////////
  // Might need it for testing trade winning and price change effects
  /* const ETH_PRICE_ID =
    "0x000000000000000000000000000000000000000000000000000000000000abcd";
  const BTC_PRICE_ID =
    "0x0000000000000000000000000000000000000000000000000000000000001234";
  const ethPrice = 1000;
  const btcPrice = 26000;
  const blockTime = 1692955175;
  //manually setting the update parameters
  //In production these will come from the api endpoint or wormhole, but here we create it ourselves
  const mockPythArgsArray = [
    ETH_PRICE_ID,
    ethPrice * 1e5,
    10 * 1e5,
    -5,
    ethPrice * 1e5,
    10 * 1e5,
    blockTime,
  ]; */

  /*   // adding a listener for contract events
  const unwatchTradeOpened = watchContractEvent(
    {
      address: orderBookContractAddress,
      abi: orderBookAbi.abi,
      eventName: "TradeOpened",
    },
    (log) => console.log(log)
  );
  const unwatchOrderClosed = watchContractEvent(
    {
      address: orderBookContractAddress,
      abi: orderBookAbi.abi,
      eventName: "OrderClosed",
    },
    (log) => console.log(log)
  ); */

  return (
    <div className="overflow-x-auto">
      <h1 className="text-white flex justify-center">Open Trades</h1>

      <div class="relative shadow-md">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Asset Pair
              </th>
              <th scope="col" className="px-6 py-3">
                Long/Short
              </th>
              <th scope="col" class="px-6 py-3">
                Open Price
              </th>
              <th scope="col" class="px-6 py-3">
                Current Price
              </th>
              <th scope="col" class="px-6 py-3">
                PNL
              </th>
              <th scope="col" class="px-6 py-3">
                Close Trade
              </th>
            </tr>
          </thead>

          {mounted && !allUserOpenTradesIsError
            ? allUserOpenTrades &&
              allUserOpenTrades.map((userTradePositionDetail, index) => {
                const pairIndex = userTradePositionDetail.pairNumber;
                const userTradeIdForPair = index % 3;
                if (userTradePositionDetail.leverage != 0) {
                  return (
                    <tbody key={`pair-${pairIndex}-trade${userTradeIdForPair}`}>
                      <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {userTradePositionDetail
                            ? assetSymbolArray[
                                userTradePositionDetail.pairNumber
                              ]
                            : "loading..."}
                        </th>
                        <td
                          className={`px-6 py-4 ${
                            userTradePositionDetail.longShort == 0
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {
                            longShortSymbolArray[
                              userTradePositionDetail.longShort
                            ]
                          }
                        </td>
                        <td class="px-6 py-4">
                          $
                          {userTradePositionDetail
                            ? formatUnits(userTradePositionDetail.openPrice, 8)
                            : "loading..."}
                        </td>
                        <td class="px-6 py-4">
                          <PriceTicker
                            pairIndex={userTradePositionDetail?.pairNumber}
                          />
                        </td>
                        <td class="px-6 py-4">
                          <PositionPnl
                            pairIndex={userTradePositionDetail.pairNumber}
                            collateral={
                              userTradePositionDetail.collateralAfterFee
                            }
                            leverage={userTradePositionDetail.leverage}
                            openPrice={userTradePositionDetail.openPrice}
                            orderType={userTradePositionDetail.longShort}
                            openTradesIdForPair={userTradeIdForPair}
                          />
                        </td>
                        <td class="px-6 py-4">
                          <CloseTrade
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

export default OpenTrades;
