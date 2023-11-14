import { useState, useEffect } from "react";
import {
  HexString,
  Price,
  EvmPriceServiceConnection,
} from "@pythnetwork/pyth-evm-js";
import { timeAgo } from "../utils/utils.jsx";

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PYTH_CONFIG = {
  eth: {
    name: "ETH/USD",
    pythPriceFeedId:
      "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  },
  btc: {
    name: "BTC/USD",
    pythPriceFeedId:
      "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  },
  priceServiceUrl: "https://xc-testnet.pyth.network",
};

export function PriceTicker(props) {
  const [pythOffChainPrice, setPythOffChainPrice] = useState();

  const pythPriceFeedIdArray = [
    "ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
    "f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  ];
  useEffect(() => {
    // The Pyth price service client is used to retrieve the current Pyth prices and the price update data that
    // needs to be posted on-chain with each transaction.
    const pythPriceService = new EvmPriceServiceConnection(
      PYTH_CONFIG.priceServiceUrl,
      {
        logger: {
          error: console.error,
          warn: console.warn,
          info: () => undefined,
          debug: () => undefined,
          trace: () => undefined,
        },
      }
    );

    pythPriceService.subscribePriceFeedUpdates(
      [PYTH_CONFIG.eth.pythPriceFeedId, PYTH_CONFIG.btc.pythPriceFeedId],
      (priceFeed) => {
        const price = priceFeed.getPriceUnchecked(); // Fine to use unchecked (not checking for staleness) because this must be a recent price given that it comes from a websocket subscription.
        setPythOffChainPrice((prev) => ({ ...prev, [priceFeed.id]: price }));
      }
    );
  }, []);

  return (
    <>
      {props.estimateTradeOpenPrice ? (
        <span>
          {" "}
          {pythOffChainPrice === undefined ||
          pythOffChainPrice[
            pythPriceFeedIdArray[props.estimateTradeOpenPrice]
          ] === undefined ? (
            <text>loading...</text>
          ) : (
            currencyFormat.format(
              Number(
                pythOffChainPrice[
                  pythPriceFeedIdArray[props.estimateTradeOpenPrice]
                ]
                  .getPriceAsNumberUnchecked()
                  .toFixed(2)
              ) +
                (props.orderType == 0
                  ? Number(
                      pythOffChainPrice[
                        pythPriceFeedIdArray[props.estimateTradeOpenPrice]
                      ].getConfAsNumberUnchecked()
                    )
                  : -1 *
                    pythOffChainPrice[
                      pythPriceFeedIdArray[props.estimateTradeOpenPrice]
                    ].getConfAsNumberUnchecked())
            )
          )}{" "}
        </span>
      ) : (
        <span>
          {" "}
          {pythOffChainPrice === undefined ||
          pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]] ===
            undefined ? (
            <span>loading...</span>
          ) : (
            currencyFormat.format(
              pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]]
                .getPriceAsNumberUnchecked()
                .toFixed(2)
            )
          )}
        </span>
      )}
    </>
  );
}
