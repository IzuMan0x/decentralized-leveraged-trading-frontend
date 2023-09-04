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
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import orderBookAbi from "../assets/OrderBook.json";
import mockPythContractAbi from "../assets/mock-pyth-abi.json";
import { abi as pythnetworkAbi } from "../assets/pythnetwork-abi.json";
import { parseEther, formatUnits } from "viem";
import { PriceTicker } from "./PythPriceText";
import CloseTrade from "./CloseTrade";
import { useIsMounted } from "@/hooks/useIsMounted";

const orderBookContractAddress =
  process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS;

function OpenTrades() {
  //This hook is to prevent the hydration error
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const [ethereumPrice, setEthereumPrice] = useState();
  const [userOpenTradesForPair, setUserOpenTradesForPair] = useState([]);
  const [displayUserTrades, setDisplayUserTrades] = useState([]);
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
  let userOpenTradesArray = [];
  //works
  for (let index = 0; index < assetArray.length; index++) {
    const {
      data: userOpenTrades,
      error: userOpenTradesError,
      isLoading: userOpenTradesIsLoading,
    } = useContractRead({
      address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
      abi: orderBookAbi.abi,
      functionName: "getUserOpenTradesForAsset",
      args: [address, index],
      watch: true,
      onSuccess(data) {
        console.log("Success on getting user open trades: ", data);
      },
    });
    console.log("userOpentradesData: ", userOpenTrades);
    console.log("userOpenTradesError: ", userOpenTradesError);
    userOpenTradesArray[index] = userOpenTrades;
    console.log("userOpenTradesArray", userOpenTradesArray);
  }

  /*   useEffect(() => {
    setUserOpenTradesForPair(userOpenTradesArray);
    setDisplayUserTrades(userTradePositionDetails);
  }, []); */

  console.log("displayUserTrades:", displayUserTrades);

  //tested and works on local network, be careful of real network delay
  console.log("getUserOpenTradesForAsset ", userOpenTradesArray);

  //Getting the trade position details
  //works
  let userTradePositionDetails = [];

  if (userTradePositionDetails !== null) {
    for (let index = 0; index < userOpenTradesArray.length; index++) {
      if (userOpenTradesArray[index] == 0) {
      } else {
        for (let i = 1; i <= userOpenTradesArray[index]; i++) {
          const {
            data: userTradePositionDetailsData,
            error: userTradePostionDetailsError,
            isLoading: userTradePostionDetailsIsLoading,
          } = useContractRead({
            address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
            abi: orderBookAbi.abi,
            functionName: "getUserTradingPositionDetails",
            args: [address, index, i],
            onSuccess(data) {
              console.log(
                "Success on getting user open postion Details: ",
                data
              );
            },
          });

          userTradePositionDetails.push(userTradePositionDetailsData);
        }
      }
    }
  }

  console.log("getUserTradingPositionDetails ", userTradePositionDetails);

  ///////////////////////
  //Testing Features////
  //////////////////////
  const ETH_PRICE_ID =
    "0x000000000000000000000000000000000000000000000000000000000000abcd";
  const BTC_PRICE_ID =
    "0x0000000000000000000000000000000000000000000000000000000000001234";
  const ethPrice = 900;
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
  ];

  // adding a listener for contract events
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
  );

  //works
  //getting the priceFeed address from the OrderBook contract
  const {
    data: pythPriceFeedAddress,
    error: getPythPriceFeedAddressError,
    isLoading: getPythPriceFeedAddressIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi.abi,
    args: [],
    functionName: "getPythPriceFeedAddress",

    onSuccess(data) {
      console.log("Success on getting pyth feed address", data);
    },
  });
  //console.log("Pyth address is: ", pythPriceFeedAddress);
  //console.log("Pyth address error is: ", getPythPriceFeedAddressError);

  const {
    data: mockPythUpdateDataArray,
    error: mockPythUpdateDataArrayError,
    isLoading: mockPythUpdateDataArrayIsLoading,
  } = useContractRead({
    address: pythPriceFeedAddress,
    abi: mockPythContractAbi.abi,
    args: mockPythArgsArray ? mockPythArgsArray : [0],
    functionName: "createPriceFeedUpdateData",

    onSuccess(data) {
      console.log("Success on getting mock pyth update data", data);
    },
  });
  //console.log("mockPythUpdateDataArray", mockPythUpdateDataArray);

  //orderClose
  const [orderCloseParameters, setOrderCloseParameters] = useState([]);

  const tradeCloseHandler = (id, pairIndex) => {
    console.log("Order close function 1245", orderClose);
    const offsetId = id + 1;
    console.log("Order close parameters are: ", id, pairIndex);
    //why is the pairIndex data undefined?????????
    const pythCallData = [mockPythUpdateDataArray];
    setOrderCloseParameters([pairIndex, offsetId, pythCallData]);
    orderClose?.();
  };

  const {
    config: orderCloseConfig,
    data: orderClosePrepareData,
    error: orderCloseError,
    isError: orderCloseIsError,
    status: orderClosePrepareStatus,
  } = usePrepareContractWrite({
    address: orderBookContractAddress,
    abi: orderBookAbi.abi,
    functionName: "orderClose",
    //The follow prevents throwing an error on the initial load when the array is undefined
    args: [
      orderCloseParameters[0],
      orderCloseParameters[1],
      orderCloseParameters[2],
    ],
    value: 1,
    onSuccess(data) {
      console.log("Success", data.result);
    },
  });
  console.log("orderCloseIsError is in error", orderCloseIsError);
  console.log("orderCloseConfig is:", orderCloseConfig);
  console.log("orderClosePrepareData is: ", orderClosePrepareData);
  console.log("Order close prepare status", orderClosePrepareStatus);
  console.log("orderClose error is: ", orderCloseError);

  const {
    data: orderCloseData,
    error: orderCloseWriteError,
    isSuccess: orderCloseSuccess,
    isLoading: orderCloseIsLoading,
    status: orderCloseWriteStatus,
    write: orderClose,
  } = useContractWrite(orderCloseConfig);
  console.log("Order Close write data 1245", orderCloseData);
  console.log("order close write is loading: ", orderCloseIsLoading);
  console.log("write order close error is: ", orderCloseWriteError);
  console.log("Order close write status is: ", orderCloseWriteStatus);
  //console.log("1245 data is: ", pythOffChainPrice);

  return (
    <>
      <div>
        <h1 className="text-white flex justify-center">Open Trades</h1>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Asset Pair
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

            {mounted && userOpenTradesArray.length >= 5
              ? userTradePositionDetails &&
                userTradePositionDetails.map(
                  (userTradePositionDetail, index) => {
                    const pairIndex = userTradePositionDetail.pairNumber;
                    return (
                      <tbody>
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
                          <td class="px-6 py-4">
                            $
                            {userTradePositionDetail
                              ? formatUnits(
                                  userTradePositionDetail.openPrice,
                                  5
                                )
                              : "loading..."}
                          </td>
                          <td class="px-6 py-4">
                            <PriceTicker
                              pairIndex={userTradePositionDetail?.pairNumber}
                            />
                          </td>
                          <td class="px-6 py-4">$PNL</td>
                          <td class="px-6 py-4">
                            {/* <div
                          class="font-medium text-red-600 dark:text-blue-500 hover:underline justify-center hover:cursor-pointer"
                          id={index}
                          pairIndex={userTradePositionDetail?.pairNumberß}
                          onClick={tradeCloseHandler}
                          closeTrade={tradeCloseHandler}
                        >
                          X
                        </div> */}

                            <CloseTrade
                              id={index}
                              value={pairIndex}
                              closeUserTrade={tradeCloseHandler}
                            />
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                )
              : null}
          </table>
        </div>
      </div>
    </>
  );
}

export default OpenTrades;
