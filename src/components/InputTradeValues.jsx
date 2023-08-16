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
import { parseEther, formatUnits, etherUnits } from "viem";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBookContractAddress =
  process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS;

//const pythPriceFeedAddress = "0xC38B1dd611889Abc95d4E0a472A667c3671c08DE";

function InputTradeValues() {
  const [orderType, setOrderType] = useState(0);
  const [orderArgs, setOrderArgs] = useState([]);
  const [priceFeedUpdateData, setPriceFeedUpdateData] = useState([]);
  const { address, isConnected } = useAccount();

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

  // In order to use Pyth prices in your protocol you need to submit the price update data to Pyth contract in your target
  // chain. `getPriceFeedsUpdateData` creates the update data which can be submitted to your contract. Then your contract should
  // call the Pyth Contract with this data.
  const pythPriceService = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
  ); // See Price Service endpoints section below for other endpoints

  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", // BTC/USD price id in testnet
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id in testnet
  ];

  useEffect(() => {
    const getPythUpdateData = async () => {
      const data = await pythPriceService.getPriceFeedsUpdateData(priceIds);
      setPriceFeedUpdateData(data);
    };

    getPythUpdateData();
  }, []);
  //console.log(priceFeedUpdateData);

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

  //works
  //retrieving array of strings with pair symbols
  const {
    data: pairSymbols,
    error: pairSymbolsError,
    isLoading: pairSymbolsIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi,
    args: [],
    functionName: "getAssetPairIndexSymbol",

    onSuccess(data) {
      console.log("Success on getting pair Symbols array", data);
    },
  });
  //console.log("pairSymbol error is: ", pairSymbolsError);

  const toggleOrderTypeHandler = () => {
    if (orderType === 0) {
      setOrderType(1);
    } else {
      setOrderType(0);
    }
  };

  //Note the update Fee is given in wei
  ////////////////////
  // Contract Reads//
  ///////////////////
  const {
    data: getUpdateFeeData,
    error: getUpdateFeeDataError,
    isLoading: getUpdateFeeDataIsLoading,
  } = useContractRead({
    address: pythPriceFeedAddress,
    abi: pythnetworkAbi,
    functionName: "getUpdateFee",
    args: [priceFeedUpdateData],
    onSuccess(data) {
      console.log(
        "Success on getting price feed update in eth",
        formatUnits(data, 18)
      );
    },
  });
  //console.log("The update fee is: ", getUpdateFeeData?.result);
  //console.log("The read is loading:", getUpdateFeeDataIsLoading);
  //console.log("The read is in error: ", getUpdateFeeDataError);

  ////////////////////
  // Contract Writes//
  ///////////////////

  const {
    config: approveTokenConfig,
    data: prepapreApproveToken,
    error: approveTokenError,
    isLoading: prepareApproveTokenIsLoading,
  } = usePrepareContractWrite({
    address: getTokenCollateralAddressData,
    abi: erc20MockAbi,
    functionName: "approve",
    args: [orderBookContractAddress, 2 ** (256 - 1)],
    onSuccess(data) {
      console.log("Success prepare contract write approve token", data.result);
    },
  });
  console.log("Approve token error is: ", approveTokenError);
  const {
    data: approveTokenData,
    isSuccess: approveTokenSuccess,
    isLoading: approveTokenIsLoading,
    write: approve,
  } = useContractWrite(approveTokenConfig);

  //marketOrder
  const {
    config: marketOrderConfig,
    data: prepareMarketOrderData,
    error: marketOrderError,
    isError: errorBool,
    isLoading: prepareMarketOrderIsLoading,
    status,
  } = usePrepareContractWrite({
    address: orderBookContractAddress,
    abi: orderBookAbi,
    functionName: "marketOrder",
    args: [
      orderArgs[0],
      orderArgs[1],
      orderArgs[2],
      orderArgs[3],
      orderArgs[4],
    ],
    value: getUpdateFeeData,
    onSuccess(data) {
      console.log("Success prepare contract write marketOrder", data.result);
    },
  });

  //console.log("The prepare marketOrder data: ", prepareMarketOrderData);
  /* console.log(
    "The prepare marketOrder is loading:",
    prepareMarketOrderIsLoading
  ); */
  console.log("The prepare marketOrder is in error: ", marketOrderError);
  //console.log("The prepare marketOrder is in error: ", errorBool);
  //console.log("The prepare marketOrder status ", status);

  const {
    data: marketOrderData,
    isSuccess: marketOrderSuccess,
    isLoading: marketOrderIsLoading,
    write: marketOrder,
  } = useContractWrite(marketOrderConfig);

  //orderClose
  const { config: orderCloseConfig, orderCloseError } = usePrepareContractWrite(
    {
      address: orderBookContractAddress,
      abi: orderBookAbi,
      functionName: "orderClose",
      args: [1, 2, priceFeedUpdateData],
      value: getUpdateFeeData,
      onSuccess(data) {
        console.log("Success", data.result);
      },
    }
  );
  const {
    data: orderCloseData,
    isSuccess: orderCloseSuccess,
    isLoading: orderCloseIsLoading,
    write: orderClose,
  } = useContractWrite(orderCloseConfig);

  //Long and short toggle
  const initiateTradeHandler = (event) => {
    event.preventDefault();
    const collateral = event.target.collateral.value;
    const leverage = event.target.leverage.value;
    const pythCallData = priceFeedUpdateData;
    const pairIndex = "0";
    setOrderArgs([
      pairIndex,
      parseEther(collateral),
      leverage,
      orderType,
      pythCallData,
    ]);

    console.log("Submitted trade data is: ", orderArgs);
    marketOrder?.();
  };

  return (
    <>
      <h1 className="text-white">Input Trade Values</h1>
      <form onSubmit={initiateTradeHandler}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              for="collateral_amount"
              className="block mb-2 text-sm font-medium text-white"
            >
              Collateral Amount
            </label>
            <input
              type="number"
              id="collateral_amount"
              name="collateral"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="150"
              required
            />
          </div>
          <div>
            <label
              htmlFor="leverage_amount"
              className="block mb-2 text-sm font-medium text-white"
            >
              Leverage Amount
            </label>
            <input
              type="number"
              id="leverage_amount"
              name="leverage"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="10"
              required
            />
          </div>
          <div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onClick={toggleOrderTypeHandler}
              />
              <div className="w-14 h-7 bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              <span className="ml-3 text-sm font-medium text-white">
                {orderType === 0 ? "Long" : "Short"}
              </span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Open Trade
        </button>
        <button
          type="button"
          onClick={() => mint?.()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Mint Test Colleater
        </button>
        <button
          type="button"
          onClick={() => approve?.()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Approve Token
        </button>
      </form>
    </>
  );
}

export default InputTradeValues;
