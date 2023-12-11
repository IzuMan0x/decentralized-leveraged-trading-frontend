import React, { useState, useEffect } from "react";
import {
  HexString,
  Price,
  EvmPriceServiceConnection,
} from "@pythnetwork/pyth-evm-js";

import { formatUnits } from "viem";
import orderBookAbi from "@/assets/OrderBook.json";
import { useAccount } from "wagmi";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

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

const pythPriceFeedIdArray = [
  "ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  "f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
];

function PositionPnl(props) {
  const [pythOffChainPrice, setPythOffChainPrice] = useState([]);
  const { address, isConnected } = useAccount();

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
  //pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]];

  /* if (price === undefined) {
        return <span style={{ color: "grey" }}>loading...</span>;
      } else {
        const now = props.currentTime.getTime() / 1000; */

  /* console.log("Pyth offchain data is : ", pythOffChainPrice);
  console.log("ordertype is: ", props.orderType);
  console.log("Collateral is after the fee: ", formatUnits(props.leverage, 6)); */

  /* const {
    data: borrowFees,
    error: borrowFeesError,
    isError: borrowFeeIsError,
    isLoading: borrowFeeIsLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getUserLiquidationPrice",
    args: [address, props.pairIndex, props.openTradesIdForPair],
    watch: true,
    onSuccess(data) {
      console.log("Success on getting user open trades: ", data);
    },
  });
  console.log("user borrow fees are", borrowFeesError); */
  return (
    <div>
      {pythOffChainPrice === undefined ||
      pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]] === undefined ? (
        <text>loading...</text>
      ) : (
        <div>
          {props.orderType == 0
            ? currencyFormat.format(
                Number(formatUnits(props.collateral, 18)) +
                  ((Number(
                    pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]]
                      .getPriceAsNumberUnchecked()
                      .toFixed(2)
                  ) -
                    Number(formatUnits(props.openPrice, 8))) /
                    Number(formatUnits(props.openPrice, 8))) *
                    Number(formatUnits(props.leverage, 6)) *
                    Number(formatUnits(props.collateral, 18))
              )
            : currencyFormat.format(
                Number(formatUnits(props.collateral, 18)) -
                  ((Number(
                    pythOffChainPrice[pythPriceFeedIdArray[props.pairIndex]]
                      .getPriceAsNumberUnchecked()
                      .toFixed(2)
                  ) -
                    Number(formatUnits(props.openPrice, 8))) /
                    Number(formatUnits(props.openPrice, 8))) *
                    Number(formatUnits(props.leverage, 6)) *
                    Number(formatUnits(props.collateral, 18))
              )}
        </div>
      )}
    </div>
  );
}

export default PositionPnl;
