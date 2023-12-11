"use client";
import React, { useState } from "react";
import NotificationBar from "@/components/NotificationBar";
import TradingViewWidget from "@/components/TradingViewWidget";
import NavBar from "@/components/NavBar";
import InfoBar from "@/components/InfoBar";
import InputTradeValues from "@/components/InputTradeValues";
import OpenTrades from "@/components/OpenTrades";
import OpenLimitOrders from "@/components/OpenLimitOrders";
import TradingPoints from "@/components/TradingPoints";
import Footer from "@/components/Footer";
import {
  //context
  useAssetList,
  useUpdateAssetList,
} from "@/components/DropDownListContext";
import { useHamburgerMenu } from "@/components/HamburgerMenuContext";
import { useNetwork } from "wagmi";
//for local environment
import MOCKTradingSection from "@/components/mock-development/MOCKTradingSection";

const localchainId = 31337;

function TradingPage() {
  //Controlling the asset changing of the tradingview widget
  const [tradingViewAsset, setTradingViewAsset] = useState("ETHUSD");
  const [tradingAssetIndex, setTradingAssetIndex] = useState(0);

  const dropdownListHidden = useAssetList();
  const toggleAssetListVisibility = useUpdateAssetList();
  const menuHidden = useHamburgerMenu();
  //The chain Id will be used to determine if we are 1.Local Chain 2.TestNet or 3.MainNet for each case we have to interact differently
  const { chain } = useNetwork();

  const tradingViewAssetChangeHandler = (assetSymbol, assetIndex) => {
    setTradingViewAsset(assetSymbol);
    setTradingAssetIndex(assetIndex);
  };

  const hideAssetListHandler = () => {
    console.log("hide asset handler ran");
    if (!dropdownListHidden) {
      toggleAssetListVisibility(true);
    } else if (!menuHidden?.state) {
      menuHidden.hideMenu(true);
    }
  };

  return (
    <div
      className=" z-[-1] bg-black h-full w-full overflow-hidden overflow-y-hidden"
      onClick={hideAssetListHandler}
    >
      <div className="w-full h-full">
        <NotificationBar></NotificationBar>
        <NavBar />
        <InfoBar
          assetSelectIndex={tradingAssetIndex}
          assetSelectSymbol={tradingViewAsset}
        ></InfoBar>
        <div className="grid h-full w-full grid-flow-column">
          <div className="h-[30rem] p-1 border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 col-span-3 mx-6 flex">
            <TradingViewWidget assetSelect={tradingViewAsset} />
          </div>
        </div>
        {chain.id === localchainId ? (
          <MOCKTradingSection
            assetChange={tradingViewAssetChangeHandler}
          ></MOCKTradingSection>
        ) : (
          <>
            <InputTradeValues assetChange={tradingViewAssetChangeHandler} />
            <div className="my-6 flex flex-center items-center justify-center border-4 border-gray-700 rounded-xl border-solid shadow-slate-700 mx-4 p-10 h-auto w-auto">
              <OpenTrades />
            </div>
            <div className="flex flex-center items-center justify-center border-4 border-gray-700 rounded-xl border-solid shadow-slate-700 mx-4 p-10 h-auto w-auto">
              <OpenLimitOrders />
            </div>
            <div className="m-4 flex justify-center">
              <TradingPoints></TradingPoints>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TradingPage;
