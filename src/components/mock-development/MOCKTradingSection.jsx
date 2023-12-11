import React from "react";
import InputTradeValues from "@/components/mock-development/MOCKInputTradeValues";
import OpenTrades from "@/components/mock-development/MOCKOpenTrades";
import MOCKOpenLimitOrders from "@/components/mock-development/MOCKOpenLimitOrders";
import TradingPoints from "@/components/TradingPoints";

function MOCKTradingSection(props) {
  return (
    <>
      <div className="lg:col-span-1 md:col-span-3">
        <div>
          <div className="border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 mx-4 my-10 flex ">
            <div className="h-full w-full flex px-6 justify-center">
              <InputTradeValues assetChange={props.assetChange} />
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
    </>
  );
}

export default MOCKTradingSection;
