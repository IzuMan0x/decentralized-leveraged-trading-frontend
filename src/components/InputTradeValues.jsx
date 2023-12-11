"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAccount, useContractRead } from "wagmi";
import { formatUnits } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "@/assets/OrderBook.json";

import erc20Abi from "@/assets/ERC20-abi.json";

import MarketLimitToggle from "@/components/MarketLimitToggle";

import LongShortToggle from "@/components/LongShortToggle";
import DropDownSelector from "@/components/DropDownSelector";
import ApproveTokenButton from "@/components/buttons/ApproveTokenButton";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Web3Button } from "@web3modal/react";
import OpenTradeButton from "@/components/buttons/OpenTradeButton";
import LimitOrderButton from "@/components/buttons/LimitOrderButton";
import TradeDetails from "@/components/TradeDetails";
import TradingNumberInput from "@/components/TradingNumberInput";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useNetwork } from "wagmi";

//MaterialUI
import Slider from "@mui/material/Slider";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi,
};

const collateralTokenAddress = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS;

const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];

//React component
function InputTradeValues(props) {
  const windowSize = useWindowSize();
  const [orderType, setOrderType] = useState(0);

  const [limitOrder, setLimitOrder] = useState("false");
  const [limitPrice, setLimitPrice] = useState("");

  const { address, isConnected } = useAccount();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [collateralInput, setCollateralInput] = useState("");
  const [leverageAmount, setLeverageAmount] = useState("");

  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("");
  const mounted = useIsMounted();
  const { chain } = useNetwork();

  //Getting the token allowance for the connected wallet to dynamically render a button
  useContractRead({
    address: collateralTokenAddress,
    abi: erc20Abi.abi,
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

  const toggleLimitOrder = (event) => {
    setLimitOrder(event.target.value);
  };

  const toggleAssetPairListHandler = () => {
    setAssetListHidden(() => !assetListHidden);
  };

  const selectedAssetHandler = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedAssetSymbol(tradingViewArray[event.target.value]);
    props.assetChange(tradingViewArray[event.target.value], event.target.value);
    //setAssetListHidden(true);
    //console.log("Selected Asset is: ", event.target.value);
  };
  const limitPriceChangeHandler = (newPrice) => {
    setLimitPrice(newPrice);
  };
  const handleLeverageSlider = (event, newValue) => {
    setLeverageAmount(newValue);
  };

  //console.log("from the inputTrader component", props.hideAssetList);

  return (
    <>
      <motion.div
        layout
        className="grid-cols-2 border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 mx-5 my-10 flex p-3 w-auto
        "
      >
        {mounted && (
          <form>
            <div className="col-span-2">
              <label className="text-sm font-medium text-white col-span-1">
                Select Trading Pair
              </label>

              <DropDownSelector
                toggleAssetPairList={toggleAssetPairListHandler}
                selectedAsset={selectedAsset}
                selectedAssetSymbol={selectedAssetSymbol}
                selectedAssetHandler={selectedAssetHandler}
                hideAssetList={props.hideAssetList}
                isAssetListHidden={props.isAssetListHidden}
              />
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
              <div className="bg-gray-700 p-2 rounded-lg hover:bg-red-900 flex justify-center">
                <Web3Button />
              </div>
            ) : tokenAllowance == 0 ||
              Number(tokenAllowance) < collateralInput ? (
              <ApproveTokenButton />
            ) : limitOrder == "false" ? (
              <OpenTradeButton
                chainId={chain.id}
                leverage={leverageAmount}
                collateral={collateralInput}
                orderType={orderType}
                pairIndex={selectedAsset}
              />
            ) : (
              <LimitOrderButton
                chainId={chain.id}
                leverage={leverageAmount}
                collateral={collateralInput}
                orderType={orderType}
                pairIndex={selectedAsset}
                targetPrice={limitPrice}
              ></LimitOrderButton>
            )}
          </form>
        )}
        {windowSize.width > 880 && (
          <TradeDetails
            limitOrder={limitOrder}
            orderType={orderType}
            selectedAsset={selectedAsset}
            collateral={collateralInput}
            leverage={leverageAmount}
            limitPrice={limitPrice}
          />
        )}
      </motion.div>
      {windowSize.width <= 880 && (
        <TradeDetails
          limitOrder={limitOrder}
          orderType={orderType}
          selectedAsset={selectedAsset}
          collateral={collateralInput}
          leverage={leverageAmount}
          limitPrice={limitPrice}
        />
      )}
    </>
  );
}

export default InputTradeValues;
