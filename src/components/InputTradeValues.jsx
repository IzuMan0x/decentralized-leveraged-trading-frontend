"use client";
import React, { useState } from "react";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
/* Hooks from WAGMI helps build a better state feedback */
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { parseEther, formatUnits, parseUnits, isBytes } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "../assets/OrderBook.json";
import pythNetworkAbi from "../assets/pythnetwork-abi.json";
import erc20Abi from "../assets/ERC20-abi.json";
//testing
import mockPythContractAbi from "../assets/mock-pyth-abi.json";
import { abi as erc20MockAbi } from "../assets/ERC20Mock-abi.json";
import { PriceTicker } from "./PythPriceText";
import LongShortToggle from "./LongShortToggle";
import TradeModal from "./TradeModal";
import OpenTradeModal from "./OpenTradeModal";
import DropDownSelector from "./DropDownSelector";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBookContractAddress =
  process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS;
console.log(orderBookContractAddress);

const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];
const openFeePercentage = 0.00075;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//React component
function InputTradeValues(props) {
  const [orderType, setOrderType] = useState(0);
  const [orderArgs, setOrderArgs] = useState([]);
  const [prepareContract, setPrepareContract] = useState(false);
  const [tradeModalCheck, setTradeModalCheck] = useState(false);
  const [priceFeedUpdateData, setPriceFeedUpdateData] = useState([]);
  const { address, isConnected } = useAccount();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [collateralInput, setCollateralInput] = useState(0);
  const [leverageAmount, setLeverageAmount] = useState();
  const [assetListHidden, setAssetListHidden] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("Nothing");

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
  const {
    data: contractTokenAllowance,
    error: contractTokenAllowanceError,
    isLoading: contractTokenAllowanceIsLoading,
  } = useContractRead({
    address: getTokenCollateralAddressData,
    abi: erc20Abi.abi,
    args: [address, orderBookContractAddress],
    functionName: "allowance",

    onSuccess(data) {
      setTokenAllowance(formatUnits(data, 18));
    },
  });

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

  //during testing we will pass the mockPythUpdateArray to the marketOrdder function

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
  console.log("The update fee is: ", getUpdateFeeData?.result);
  //console.log("The read is loading:", getUpdateFeeDataIsLoading);
  //console.log("The read is in error: ", getUpdateFeeDataError);
 */
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
    abi: erc20Abi.abi,
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

  //Long and short toggle
  const initiateTradeHandler = async (event) => {
    event.preventDefault();
    if (prepareContract == false) {
      const pythPriceService = new EvmPriceServiceConnection(
        "https://xc-testnet.pyth.network"
      );
      const priceFeedUpdateData =
        await pythPriceService.getPriceFeedsUpdateData([
          "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
        ]);
      const pythUpdateFee = await readContract({
        address: "0x2880aB155794e7179c9eE2e38200202908C17B43",
        abi: pythNetworkAbi.abi,
        functionName: "getUpdateFee",
        args: [priceFeedUpdateData],
      });
      let orderTypeArgs;
      setOrderType((prev) => {
        orderTypeArgs = prev;
        return prev;
      });
      //Collateral is 1e18 which is the same as ethereum
      const collateral = parseEther(event.target.collateral.value);
      //leverage is 1e6
      const leverage = parseUnits(event.target.leverage.value, 6);
      //const pythCallData = [mockPythUpdateDataArray];
      //This needs to be set by the user
      const pairIndex = selectedAsset;

      setOrderArgs([
        pairIndex,
        collateral,
        leverage,
        orderTypeArgs,
        priceFeedUpdateData,
        pythUpdateFee,
      ]);

      console.log("The submitted orderType is: ", orderTypeArgs);
      setTradeModalCheck(true);
    } else {
      //marketOrder?.();
    }

    //marketOrder?.();
  };

  const closeTradeModal = () => {
    setTradeModalCheck(false);
  };

  const toggleAssetPairListHandler = () => {
    setAssetListHidden(() => !assetListHidden);
  };
  const closeAssetDropDownListHandler = () => {
    setAssetListHidden(true);
  };

  const selectedAssetHandler = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedAssetSymbol(tradingViewArray[event.target.value]);
    props.assetChange(tradingViewArray[event.target.value], event.target.value);
    setAssetListHidden(true);
    console.log("Selected Asset is: ", event.target.value);
  };

  return (
    <div>
      {/* {marketOrderSuccess ? setModal(true) : ""} */}
      {false && (
        <TradeModal
          mainMessage={"Trade Successfully Opened!!!"}
          buttonMessage={"Well done"}
        />
      )}
      {tradeModalCheck && (
        <OpenTradeModal
          mainMessage={`Trade Parameters are:`}
          buttonMessage={"Confirm Trade"}
          orderArgs={orderArgs}
          closeModal={closeTradeModal}
        ></OpenTradeModal>
      )}
      <form onSubmit={initiateTradeHandler}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <h1 className="col-span-2 block m-2 text-sm font-medium text-white">
            Selected Trading Pair
          </h1>
          <div className="col-span-2 flex w-full">
            <DropDownSelector
              toggleAssetPairList={toggleAssetPairListHandler}
              selectedAsset={selectedAsset}
              selectedAssetSymbol={selectedAssetSymbol}
              selectedAssetHandler={selectedAssetHandler}
              dropDownListHidden={assetListHidden}
              hideList={closeAssetDropDownListHandler}
            />
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
              value={collateralInput}
              onChange={(event) => setCollateralInput(event.target.value)}
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
              value={leverageAmount}
              onChange={(event) => {
                setLeverageAmount(event.target.value);
              }}
              pattern="\d{3}"
              name="leverage"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1 to 150"
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
        {tokenAllowance == 0 || Number(tokenAllowance) < collateralInput ? (
          <button
            type="button"
            onClick={() => approve?.()}
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Approve Token
          </button>
        ) : (
          <button
            type="submit"
            className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Open Trade
          </button>
        )}

        {/*  <button
          type="button"
          onClick={() => mint?.()}
          className="text-white my-2 mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Mint Test Collateral
        </button> */}
      </form>
      <div className="flex text-white mx-10 border-solid border-4 border-white px-6 py-3 my-4">
        <h1 className="text-white flex-shrink">
          Estimated Execution Price:
          <PriceTicker
            estimateTradeOpenPrice={selectedAsset}
            orderType={orderType}
          ></PriceTicker>
        </h1>
        <h1 className="text-red-500 flex shrink">
          {`Opening Fee is: 
          ${currencyFormat.format(
            collateralInput * leverageAmount * openFeePercentage
          )}`}
        </h1>
      </div>
    </div>
  );
}

export default InputTradeValues;
