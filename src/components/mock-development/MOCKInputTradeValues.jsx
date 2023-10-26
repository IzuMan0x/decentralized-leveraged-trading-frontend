"use client";
import React, { useState, useEffect } from "react";
//import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { parseEther, formatUnits, parseUnits } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "../../assets/OrderBook.json";
import pythNetworkMockAbi from "../../assets/mock-pyth-abi.json";
import erc20MockAbi from "../../assets/ERC20Mock-abi.json";

import { PriceTicker } from "../PythPriceText";
import LongShortToggle from "../LongShortToggle";
import TradeModal from "../TradeModal";
import OpenTradeModal from "../OpenTradeModal";
import DropDownSelector from "../DropDownSelector";
import ApproveTokenButton from "../buttons/ApproveTokenButton";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Web3Button } from "@web3modal/react";
import OpenTradeButton from "../buttons/OpenTradeButton";
import TradeDetails from "../TradeDetails";
import MarketLimitToggle from "../MarketLimitToggle";
import LimitStrikePrice from "../LimitStrikePrice";

//Testing
import MOCKApproveTokenButton from "./MOCKApproveTokenButton";
import MOCKMintTokenButton from "./MOCKMintTokenButton";
import MOCKOpenTradeButton from "./MOCKOpenTradeButton";
import MOCKLimitOrderButton from "./MOCKLimitOrderButton";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
//orderBookContractAddress
const pythNetwork = {
  abi: pythNetworkMockAbi.abi,
  address: process.env.NEXT_PUBLIC_PYTH_CONTRACT_ADDRESS,
};

const testingBool = process.env.NEXT_PUBLIC_TESTING_BOOL;
const collateralTokenAddress = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS;

const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];
const openFeePercentage = 0.00075;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//React component
function InputTradeValues(props) {
  const [orderType, setOrderType] = useState(0);
  const [orderArgs, setOrderArgs] = useState({
    pairIndex: -1,
    amountCollateral: 0,
    leverage: 0,
    orderType: -1,
    pythData: ["something"],
  });
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
  const mounted = useIsMounted();
  //getting related contract addresses
  const [collateralTokenAddress, setCollateralTokenAddress] = useState("");
  const [pythContractAddress, setPythContractAddress] = useState("");

  const [limitOrder, setLimitOrder] = useState("false");
  const [limitPrice, setLimitPrice] = useState(0);

  /* For local environment where we have to deploy mocks the address may change after each deployment so it makes sense to read the address from the main OrderBook contract so that only
  the OrderBook contract address will have to be updated in the .env file. For production environment the contract addresses will all be defiend in the env file for speed*/
  useEffect(() => {
    const getTokenAndPythAddress = async () => {
      const tokenAddress = await readContract({
        address: orderBook.address,
        abi: orderBook.abi,
        functionName: "getTokenCollateralAddress",
      });
      const pythAddress = await readContract({
        address: orderBook.address,
        abi: orderBook.abi,
        functionName: "getPythPriceFeedAddress",
      });

      setCollateralTokenAddress(tokenAddress);
      setPythContractAddress(pythAddress);
    };

    getTokenAndPythAddress();
  }, []);

  ////////////////////////////////////////////////////////////////////
  //Functions for Testing the Contract Intereacting with Mocks etc.///
  ////////////////////////////////////////////////////////////////////

  // for production this may just be an .env variable

  const {
    data: contractTokenAllowance,
    error: contractTokenAllowanceError,
    isLoading: contractTokenAllowanceIsLoading,
  } = useContractRead({
    address: collateralTokenAddress,
    abi: erc20MockAbi.abi,
    args: [address, orderBook.address],
    functionName: "allowance",

    onSuccess(data) {
      setTokenAllowance(formatUnits(data, 18));
    },
  });

  const toggleOrderTypeHandler = (event) => {
    setOrderType(event.target.value);

    //console.log("ordertype is: ", orderType);
  };

  ////////////////////
  // Contract Writes//
  ///////////////////

  /* const {
    config: approveTokenConfig,
    data: prepapreApproveToken,
    error: approveTokenError,
    isLoading: prepareApproveTokenIsLoading,
  } = usePrepareContractWrite({
    address: collateralTokenAddress,
    abi: erc20MockAbi.abi,
    functionName: "approve",
    args: [orderBook.address, 2 ** (256 - 1)],
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
  } = useContractWrite(approveTokenConfig); */

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
  const toggleLimitOrder = (event) => {
    setLimitOrder(event.target.value);
  };
  const limitPriceChangeHandler = (newPrice) => {
    setLimitPrice(newPrice);
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
      {tradeModalCheck &&
        false(
          <OpenTradeModal
            mainMessage={`Trade Parameters are:`}
            buttonMessage={"Confirm Trade"}
            orderArgs={orderArgs}
            closeModal={closeTradeModal}
          ></OpenTradeModal>
        )}
      {mounted && (
        <form>
          <div className="grid gap-2 mb-1 md:grid-cols-2">
            <div className="col-span-2 my-2">
              <MarketLimitToggle
                toggle={toggleLimitOrder}
                limitOrder={limitOrder}
              ></MarketLimitToggle>
            </div>
            <div className="col-span-2 my-2">
              <LimitStrikePrice
                limitPrice={limitPrice}
                limitOrder={limitOrder}
                limitPriceChangeHandler={limitPriceChangeHandler}
              ></LimitStrikePrice>
            </div>
            <div className="col-span-2 m-2">
              <MOCKMintTokenButton tokenAddress={collateralTokenAddress} />
            </div>

            <div className="col-span-2 my-2">
              <LongShortToggle
                toggle={toggleOrderTypeHandler}
                orderType={orderType}
              ></LongShortToggle>
            </div>

            <div>
              <label className="text-sm font-medium text-white">
                Selected Trading Pair
              </label>
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
                className="flex -webkit-appearance:none -moz-appearance:textfield my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                className="bg-gray-50 border my-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1 to 150"
                required
              />
            </div>
          </div>
          {isConnected == false ? (
            <div className="bg-red-700 text-center items-center p-2 rounded-lg hover:bg-red-900">
              <Web3Button />
            </div>
          ) : tokenAllowance == 0 ||
            Number(tokenAllowance) < collateralInput ? (
            <MOCKApproveTokenButton tokenAddress={collateralTokenAddress} />
          ) : limitOrder == "false" ? (
            <MOCKOpenTradeButton
              leverage={leverageAmount}
              collateral={collateralInput}
              orderType={orderType}
              pairIndex={selectedAsset}
            />
          ) : (
            <MOCKLimitOrderButton
              leverage={leverageAmount}
              collateral={collateralInput}
              orderType={orderType}
              pairIndex={selectedAsset}
              limitPrice={limitPrice}
            ></MOCKLimitOrderButton>
          )}
        </form>
      )}

      <TradeDetails
        orderType={orderType}
        selectedAsset={selectedAsset}
        collateral={collateralInput}
        leverage={leverageAmount}
      />
    </div>
  );
}

export default InputTradeValues;

{
  /* <div className="flex text-white mx-10 border-solid border-4 border-white px-6 py-3 my-4">
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
</div> */
}
