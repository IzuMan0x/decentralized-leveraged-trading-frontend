"use client";
import React, { useEffect, useState } from "react";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
/* Hooks from WAGMI helps build a better state feedback */
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import { abi as orderBookAbi } from "../assets/orderbook-contract-abi.json";
import { abi as pythnetworkAbi } from "../assets/pythnetwork-abi.json";
import { parseEther, formatUnits } from "viem";

function OpenTrades() {
  const { address, isConnected } = useAccount();
  ////////////////////
  // Contract Reads//
  ///////////////////
  //works
  const {
    data: userOpenTrades,
    error: userOpenTradesError,
    isLoading: userOpenTradesIsLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
    abi: orderBookAbi,
    functionName: "getUserOpenTradesForAsset",
    args: [address, 0],
    onSuccess(data) {
      console.log("Success on getting user open treaddes for Eth: ", data);
    },
  });
  //console.log("The update fee is: ", userOpenTrades?.result);
  //console.log("The read is loading:", userOpenTradesIsLoading);
  //console.log("The read is in error: ", userOpenTradesError);

  return <div className="text-white">OpenTrades</div>;
}

export default OpenTrades;
