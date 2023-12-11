"use client";
import React, { useState, useEffect } from "react";
//import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { useAccount, useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { formatUnits } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "@/assets/OrderBook.json";

import erc20MockAbi from "@/assets/ERC20Mock-abi.json";

import LongShortToggle from "@/components/LongShortToggle";

import DropDownSelector from "@/components/DropDownSelector";

import { useIsMounted } from "@/hooks/useIsMounted";
import { Web3Button } from "@web3modal/react";

import TradeDetails from "@/components/TradeDetails";
import MarketLimitToggle from "@/components/MarketLimitToggle";

import TradingNumberInput from "@/components/TradingNumberInput";
import { motion, AnimatePresence } from "framer-motion";
//MaterialUI
import Slider from "@mui/material/Slider";
//Testing
import MOCKApproveTokenButton from "@/components/mock-development/MOCKApproveTokenButton";
import MOCKMintTokenButton from "@/components/mock-development/MOCKMintTokenButton";
import MOCKOpenTradeButton from "@/components/mock-development/MOCKOpenTradeButton";
import MOCKLimitOrderButton from "@/components/mock-development/MOCKLimitOrderButton";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
//orderBookContractAddress

const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];

//React component
function InputTradeValues(props) {
  const [orderType, setOrderType] = useState(0);
  const { address, isConnected } = useAccount();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [collateralInput, setCollateralInput] = useState("");
  const [leverageAmount, setLeverageAmount] = useState("");
  const [assetListHidden, setAssetListHidden] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("Nothing");
  const mounted = useIsMounted();
  //getting related contract addresses
  const [collateralTokenAddress, setCollateralTokenAddress] = useState("");
  const [pythContractAddress, setPythContractAddress] = useState("");

  const [limitOrder, setLimitOrder] = useState("false");
  const [limitPrice, setLimitPrice] = useState();

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

    console.log("Selected Asset is: ", event.target.value);
  };
  const toggleLimitOrder = (event) => {
    setLimitOrder(event.target.value);
  };
  const limitPriceChangeHandler = (newPrice) => {
    setLimitPrice(newPrice);
  };
  const handleLeverageSlider = (event, newValue) => {
    setLeverageAmount(newValue);
  };

  return (
    <div>
      {mounted && (
        <form>
          <div className="col-span-2 m-2">
            <MOCKMintTokenButton tokenAddress={collateralTokenAddress} />
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
              />
            </div>
          </div>
          <div className="grid gap-2 mb-1 md:grid-cols-2">
            <div className="col-span-2 my-2">
              <LongShortToggle
                toggle={toggleOrderTypeHandler}
                orderType={orderType}
              ></LongShortToggle>
            </div>
            <div className="col-span-2 my-">
              <MarketLimitToggle
                toggle={toggleLimitOrder}
                limitOrder={limitOrder}
              ></MarketLimitToggle>
            </div>
            <div className="flex">
              <TradingNumberInput
                changeHandler={setCollateralInput}
                value={collateralInput}
                name="collateral"
                id="collateral-amount"
                text="Enter Collateral"
              ></TradingNumberInput>
            </div>

            <AnimatePresence>
              {limitOrder == "true" && (
                <motion.div
                  key="limit-price"
                  initial={{ opacity: 0, y: +30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: +30 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-2 my-2 h-24"
                >
                  <TradingNumberInput
                    id="limit-price"
                    value={limitPrice}
                    name="limit-price"
                    text="Enter Limit Price"
                    changeHandler={limitPriceChangeHandler}
                  ></TradingNumberInput>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="col-span-2">
              <div>
                <label
                  htmlFor="leverage_amount"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Leverage Slider
                </label>
                <Slider
                  aria-label="Small steps"
                  defaultValue={1}
                  onChange={handleLeverageSlider}
                  step={1}
                  min={1}
                  max={150}
                  marks={true}
                  valueLabelDisplay="auto"
                />
              </div>
              <TradingNumberInput
                changeHandler={setLeverageAmount}
                value={leverageAmount}
                name="leverage"
                id="leverage-amount"
                text="Enter Leverage"
              ></TradingNumberInput>
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
        limitOrder={limitOrder}
        orderType={orderType}
        selectedAsset={selectedAsset}
        collateral={collateralInput}
        leverage={leverageAmount}
        limitPrice={limitPrice}
      />
    </div>
  );
}

export default InputTradeValues;
