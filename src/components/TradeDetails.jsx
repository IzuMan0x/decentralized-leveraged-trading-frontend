import React from "react";
import { PriceTicker } from "./PythPriceText";
import LiquidationPrice from "./LiquidationPrice";

const openFeePercentage = 0.00075;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const assetSymbolArray = [
  "ETH/USD",
  "BTC/USD",
  "XRP/USD",
  "MATIC/USD",
  "BNB/USD",
];

function TradeDetails(props) {
  return (
    <div className="flex text-white mx-5 border-solid border-4 border-gray-700 shadow-md rounded-lg px-6 py-3 my-4">
      <div>
        <h1 className="mb-2 text-lg font-semibold text-white">
          Position Details
        </h1>

        <ul className="max-w-md space-y-1 list-disc list-inside text-gray-400">
          <li>
            <span>
              Trading Pair is:{" "}
              <span className="text-yellow-600">
                ${assetSymbolArray[props.selectedAsset]}
              </span>
            </span>
          </li>
          <li>
            <span>
              Estimated Execution Price:{" "}
              {props.limitOrder === "true" ? (
                currencyFormat.format(props.limitPrice)
              ) : (
                <PriceTicker
                  pairIndex={props.selectedAsset}
                  estimateTradeOpenPrice={props.selectedAsset}
                  orderType={props.orderType}
                ></PriceTicker>
              )}
            </span>
          </li>
          <li>
            Position Size is:{" "}
            {`${currencyFormat?.format(
              props.collateral * props.leverage -
                props.collateral * props.leverage * openFeePercentage -
                (props.limitOrder === "true" ? 2 : 0)
            )}`}
          </li>
          <li>
            {`Opening Fee is: 
      ${currencyFormat?.format(
        props.collateral * props.leverage * openFeePercentage +
          (props.limitOrder === "true" ? 2 : 0)
      )}`}
          </li>
          <li>
            Est. Liquidation Price is:{" "}
            {props.limitOrder === "true" ? (
              <span> N/A</span>
            ) : (
              <span>
                <LiquidationPrice
                  pairIndex={props.selectedAsset}
                  leverage={props.leverage}
                  orderType={props.orderType}
                ></LiquidationPrice>
              </span>
            )}
          </li>
          <li>
            {" "}
            {props.orderType == 0 ? (
              <span className="text-green-600">Long</span>
            ) : (
              <span className="text-red-700">Short</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TradeDetails;
