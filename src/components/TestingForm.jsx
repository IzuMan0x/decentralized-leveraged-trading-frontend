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
import { abi as erc20MockAbi } from "../assets/ERC20Mock-abi.json";
import { parseEther, formatUnits } from "viem";

function TestingForm() {
  const { address, isConnected } = useAccount();
  const orderBookContractAddress =
    process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS;
  //works
  const {
    data: pythPriceFeedAddress,
    error: getPythPriceFeedAddressError,
    isLoading: getPythPriceFeedAddressIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi,
    args: [],
    functionName: "getPythPriceFeedAddress",

    onSuccess(data) {
      console.log("Success on getting pyth feed address", data);
    },
  });
  //console.log("Pyth address is: ", pythPriceFeedAddress);
  //console.log("Pyth address error is: ", getPythPriceFeedAddressError);

  ////////////////////
  // Testing Contract//
  ///////////////////

  const {
    data: getTokenCollateralAddressData,
    error: getTokenCollateralAddressError,
    isLoading: getTokenCollateralAddressIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi,
    args: [],
    functionName: "getTokenCollateralAddress",

    onSuccess(data) {
      console.log("Success on getting pyth feed address", data);
    },
  });

  console.log("token collateral address is: ", getTokenCollateralAddressData);

  //mint erc20 token for testing
  //This is just for test purposes to mint collateral so we can interact with the contract
  const mockTokenCollateralAddress =
    "0x71c95911e9a5d330f4d621842ec243ee1343292e";
  const {
    config: mintConfig,
    data: prepareMintData,
    error: mintError,
    isError: mintErrorBool,
    isLoading: prepareMintIsLoading,
    status: prepareMintStatus,
  } = usePrepareContractWrite({
    address: getTokenCollateralAddressData,
    abi: erc20MockAbi,
    functionName: "mint",
    args: [address, parseEther("1000")],
    onSuccess(data) {
      console.log(
        "Success prepare contract write mint erc20 mock",
        data.result
      );
    },
  });
  console.log("Prepare erc20 mint data is: ", prepareMintData);
  console.log("Prepare erc20 mint  error is: ", mintError);

  const {
    data: mintData,
    isSuccess: mintIsSuccess,
    isLoading: mintIsLoading,
    write: mint,
  } = useContractWrite(mintConfig);

  return (
    <form className=" px-6">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label class="block mb-2 text-sm font-medium text-white">
            Mint Amount
          </label>
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="1000"
          />
          <button
            type="button"
            className="m-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Mint
          </button>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Empty
          </label>
          <input
            type="text"
            id="last_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="not used"
          />
        </div>
        <div>
          <div className="">
            <label class="block mb-2 font-medium text-white text-sm">
              Pair Index
            </label>
          </div>

          <input
            type="text"
            id="company"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Collateral Pair Index"
          />
          <button
            type="button"
            className="m-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-white">
            New Pyth Price
          </label>
          <input
            name="newPriceFeed"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="1000"
          />
        </div>
      </div>
    </form>
  );
}

export default TestingForm;
