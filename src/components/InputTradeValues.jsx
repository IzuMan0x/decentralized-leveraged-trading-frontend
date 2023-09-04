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
import { parseEther, formatUnits, etherUnits, parseUnits, isBytes } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "../assets/OrderBook.json";
import pythNetworkAbi from "../assets/pythnetwork-abi.json";
//testing
import mockPythContractAbi from "../assets/mock-pyth-abi.json";
import { abi as erc20MockAbi } from "../assets/ERC20Mock-abi.json";
import { PriceTicker } from "./PythPriceText";
import LongShortToggle from "./LongShortToggle";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBookContractAddress =
  process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS;
console.log(orderBookContractAddress);

const pythNetworkContractAddress =
  process.env.NEXT_PUBLIC_PYTH_PRICE_FEED_ADDRESS;

//React component
function InputTradeValues(props) {
  const [orderType, setOrderType] = useState(0);
  const [orderArgs, setOrderArgs] = useState([]);
  const [priceFeedUpdateData, setPriceFeedUpdateData] = useState([]);
  const { address, isConnected } = useAccount();

  ////////////////////////////////////////////////////////////////////
  //Functions for Testing the Contract Intereacting with Mocks etc.///
  ////////////////////////////////////////////////////////////////////

  //Here we are retrieving the token collateral address
  // for production this may just be an .env variable
  const {
    data: getTokenCollateralAddressData,
    error: getTokenCollateralAddressError,
    isLoading: getTokenCollateralAddressIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi.abi,
    args: [],
    functionName: "getTokenCollateralAddress",

    onSuccess(data) {
      console.log(
        "Success on getting OrderBook token Collateral Address",
        data
      );
    },
  });
  console.log("Token collateral address is: ", getTokenCollateralAddressData);

  //mint erc20 token for testing
  //This is just for test purposes to mint collateral so we can interact with the contract
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
    args: [address, parseEther("10000")],
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

  //interacting with the MOCK pyth address
  //these price ID's are created when we inititially deply the mock contract
  //note price ID's need to be in string format
  const ETH_PRICE_ID =
    "0x000000000000000000000000000000000000000000000000000000000000abcd";
  const BTC_PRICE_ID =
    "0x0000000000000000000000000000000000000000000000000000000000001234";
  const ethPrice = 1000;
  const btcPrice = 26000;
  const blockTime = 1692954175;
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
    args: mockPythArgsArray,
    functionName: "createPriceFeedUpdateData",

    onSuccess(data) {
      console.log("Success on getting mock pyth update data", data);
    },
  });
  console.log("Mock pyth update data error is: ", mockPythUpdateDataArrayError);
  console.log("Mock pyth update data is: ", mockPythUpdateDataArray);

  //during testing we will pass the mockPythUpdateArray to the marketOrdder function

  ////////////////
  // Production//
  ///////////////

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

  /* const updateDataArray = useEffect(() => {
    const getPythUpdateData = async () => {
      const data = await pythPriceService.getPriceFeedsUpdateData(priceIds);
      setPriceFeedUpdateData(data);
    };

    getPythUpdateData();
  }, []); */
  //console.log(priceFeedUpdateData);

  //works
  //retrieving array of strings with pair symbols
  /* const {
    data: pairSymbols,
    error: pairSymbolsError,
    isLoading: pairSymbolsIsLoading,
  } = useContractRead({
    address: orderBookContractAddress,
    abi: orderBookAbi.abi,
    args: [],
    functionName: "getAssetPairIndexSymbol",

    onSuccess(data) {
      console.log("Success on getting pair Symbols array", data);
    },
  }); */
  //console.log("pairSymbol error is: ", pairSymbolsError);

  const toggleOrderTypeHandler = () => {
    setOrderType((previous) => {
      if (previous == 0) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log("ordertype is: ", orderType);
  };

  //Note the update Fee is given in wei
  ////////////////////
  // Contract Reads//
  ///////////////////
  //For testing this is not being used, but we will need it for production
  /* const {
    data: getUpdateFeeData,
    error: getUpdateFeeDataError,
    isLoading: getUpdateFeeDataIsLoading,
  } = useContractRead({
    address: pythPriceFeedAddress,
    abi: pythNetworkAbi.abi,
    functionName: "getUpdateFee",
    args: [updateDataArray],
    onSuccess(data) {
      console.log(
        "Success on getting price feed update in eth",
        formatUnits(data, 18)
      );
    },
  });
  console.log("The update fee is: ", getUpdateFeeData?.result); */
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
    abi: orderBookAbi.abi,
    functionName: "marketOrder",
    args: [
      orderArgs[0],
      orderArgs[1],
      orderArgs[2],
      orderArgs[3],
      orderArgs[4],
    ],
    value: 1, //getUpdateFeeData,
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

  //Long and short toggle
  const initiateTradeHandler = (event) => {
    event.preventDefault();
    //Collateral is 1e18 which is the same as ethereum
    const collateral = parseEther(event.target.collateral.value);
    //leverage is 1e6
    const leverage = parseUnits(event.target.leverage.value, 6);
    const pythCallData = [mockPythUpdateDataArray];
    //This needs to be set by the user
    const pairIndex = selectedAsset;
    setOrderArgs([pairIndex, collateral, leverage, orderType, pythCallData]);

    console.log("Submitted trade data is: ", orderArgs);
    marketOrder?.();
  };

  const [assetListHidden, setAssetListHidden] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("");

  const toggleAssetPairListHandler = () => {
    setAssetListHidden(() => !assetListHidden);
  };

  const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];

  const selctedAssetHandler = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedAssetSymbol(tradingViewArray[event.target.value]);
    props.assetChange(tradingViewArray[event.target.value]);
    setAssetListHidden(true);
    console.log("Selected Asset is: ", event.target.value);
  };

  return (
    <>
      <h1 className="text-white">Input Trade Values</h1>
      <form onSubmit={initiateTradeHandler}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <button
              id="dropdownSearchButton"
              data-dropdown-toggle="dropdownSearch"
              data-dropdown-placement="bottom"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={toggleAssetPairListHandler}
            >
              Select Asset Pair {selectedAssetSymbol}
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdownSearch"
              className={`z-10 ${
                assetListHidden && "hidden"
              } bg-white rounded-lg shadow w-60 dark:bg-gray-700 absolute`}
            >
              <div class="p-3">
                <label for="input-group-search" class="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400 z-10"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="input-group-search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search asset"
                  />
                </div>
              </div>
              <ul
                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                <li>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={selectedAsset == 0}
                      id="checkbox-item-11"
                      type="checkbox"
                      value={0}
                      onClick={selctedAssetHandler}
                      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                    />
                    <label
                      for="checkbox-item-11"
                      class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      ETH/USD
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={selectedAsset == 1}
                      id="checkbox-item-12"
                      type="checkbox"
                      value={1}
                      onClick={selctedAssetHandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="checkbox-item-12"
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      BTC/USD
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={selectedAsset == 2}
                      id="checkbox-item-13"
                      type="checkbox"
                      value={2}
                      onClick={selctedAssetHandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="checkbox-item-13"
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      XRP/USD
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={selectedAsset == 3}
                      id="checkbox-item-14"
                      type="checkbox"
                      value={3}
                      onClick={selctedAssetHandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="checkbox-item-14"
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      MATIC/USD
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={selectedAsset == 4}
                      id="checkbox-item-15"
                      type="checkbox"
                      value={4}
                      onClick={selctedAssetHandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="checkbox-item-15"
                      class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      BNB/USD
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label
              for="collateral_amount"
              className="block mb-2 text-sm font-medium text-white"
            >
              Collateral Amount
            </label>
            <input
              type="number"
              min={10}
              id="collateral_amount"
              name="collateral"
              className="flex -webkit-appearance:none -moz-appearance:textfield m-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              min={1}
              max={150}
              name="leverage"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="10"
              required
            />
          </div>
          <div>
            <LongShortToggle
              toggle={toggleOrderTypeHandler}
              orderType={orderType}
            ></LongShortToggle>
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
          Mint Test Collateral
        </button>
        <button
          type="button"
          onClick={() => approve?.()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Approve Token
        </button>
      </form>
      <div className="text-white mx-10 border-solid border-4 border-white px-6 py-3 my-4">
        <h1 className="text-white">Estimated Execution Price:</h1>

        <PriceTicker
          estimateTradeOpenPrice={selectedAsset}
          orderType={orderType}
        ></PriceTicker>
      </div>
    </>
  );
}

export default InputTradeValues;
