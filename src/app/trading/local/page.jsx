"use client";
//Note we are working on removing this page and puting the switch logic into the main trading page
import React, { useState } from "react";
import NotificationBar from "@/components/NotificationBar";
import TradingViewWidget from "@/components/TradingViewWidget";
import NavBar from "@/components/NavBar";
import InfoBar from "@/components/InfoBar";
import InputTradeValues from "@/components/mock-development/MOCKInputTradeValues";
import OpenTrades from "@/components/mock-development/MOCKOpenTrades";
import MOCKOpenLimitOrders from "@/components/mock-development/MOCKOpenLimitOrders";
import TradingPoints from "@/components/TradingPoints";
import Footer from "@/components/Footer";
import {
  useAssetList,
  useUpdateAssetList,
} from "@/components/DropDownListContext";

function TradingPage() {
  const [tradingViewAsset, setTradingViewAsset] = useState("ETHUSD");
  const [tradingAssetIndex, setTradingAssetIndex] = useState(0);

  const dropdownListHidden = useAssetList();
  const toggleAssetListVisibility = useUpdateAssetList();

  const tradingViewAssetChangeHandler = (assetSymbol, assetIndex) => {
    setTradingViewAsset(assetSymbol);
    setTradingAssetIndex(assetIndex);
  };

  const hideAssetListHandler = () => {
    console.log("hide asset handler ran");
    if (!dropdownListHidden) {
      toggleAssetListVisibility(true);
    } else {
      console.log("Cannot close what is not hidden... from the trading page");
    }
  };

  return (
    <div
      className=" bg-black h-full w-full overflow-hidden overflow-y-hidden"
      onClick={hideAssetListHandler}
    >
      <div className="w-full h-full">
        <NotificationBar></NotificationBar>
        <div>
          <NavBar />
        </div>

        <div className="grid h-full w-full py-10 lg:grid-cols-3 md:grid-flow-row">
          <div className="border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 col-span-2 mx-4 flex">
            <div className="grid grid-rows-6">
              <div className="row-span-1">
                <InfoBar
                  assetSelectIndex={tradingAssetIndex}
                  assetSelectSymbol={tradingViewAsset}
                ></InfoBar>
              </div>

              <div className="row-span-5 p-2 flex">
                <TradingViewWidget assetSelect={tradingViewAsset} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 md:col-span-3">
            <div>
              <div className="border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 mx-4 my-10 flex ">
                <div className="h-full w-full flex px-6 justify-center">
                  <InputTradeValues
                    assetChange={tradingViewAssetChangeHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-center items-center justify-center border-4 border-gray-700 rounded-xl border-solid shadow-slate-700 mx-4 p-10 h-auto w-auto">
          <OpenTrades />
        </div>
        <div className="flex flex-center items-center justify-center border-4 border-gray-700 rounded-xl border-solid shadow-slate-700 mx-4 p-10 h-auto w-auto">
          <MOCKOpenLimitOrders />
        </div>
        <div className="m-4 flex justify-center">
          <TradingPoints></TradingPoints>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TradingPage;
