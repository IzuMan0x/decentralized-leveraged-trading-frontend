import {
  usePrepareContractWrite,
  useContractRead,
  useContractWrite,
} from "wagmi";
import mockPythContractAbi from "../../assets/mock-pyth-abi.json";
import orderBookAbi from "../../assets/OrderBook.json";
import TradeModal from "../TradeModal";

import React, { useState } from "react";

import pythNetworkAbi from "../../assets/pythnetwork-abi.json";

import { parseEther, formatUnits, parseUnits } from "viem";

import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

//This setup worked at least once 🧐

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

const pythNetwork = {
  abi: pythNetworkAbi,
  address: process.env.NEXT_PUBLIC_PYTH_CONTRACT_ADDRESS,
};

function CloseTrade(props) {
  ///////////////////////
  //Testing Features////
  //////////////////////
  const ETH_PRICE_ID =
    "0x000000000000000000000000000000000000000000000000000000000000abcd";
  const BTC_PRICE_ID =
    "0x0000000000000000000000000000000000000000000000000000000000001234";
  const ethPrice = 1000;
  const btcPrice = 26000;
  const blockTime = 1692955175;
  //manually setting the update parameters
  //In production these will come from the api endpoint or wormhole, but here we create it ourselves
  const mockPythArgsArray = [
    ETH_PRICE_ID,
    ethPrice * 1e5,
    10 * 1e5,
    -5,
    ethPrice * 1e5,
    10 * 1e5,
    blockTime,
  ];

  const {
    data: mockPythUpdateDataArray,
    error: mockPythUpdateDataArrayError,
    isLoading: mockPythUpdateDataArrayIsLoading,
  } = useContractRead?.({
    address: pythPriceAddress,
    abi: mockPythContractAbi.abi,
    args: mockPythArgsArray,
    functionName: "createPriceFeedUpdateData",

    onSuccess(data) {
      console.log("Success on getting mock pyth update data", data);
    },
  });
  console.log(
    "mockPythUpdateDataArray from close trade",
    mockPythUpdateDataArray
  );

  console.log("pyth price feed address is", props.address);
  ////////////////////////
  //above is for local testing only the actual data will come from the pyth api
  ////////////////////////

  const {
    config: orderCloseConfig,
    data: orderClosePrepareData,
    error: orderCloseError,
    isError: orderCloseIsError,
    status: orderClosePrepareStatus,
  } = usePrepareContractWrite({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "orderClose",
    //The follow prevents throwing an error on the initial load when the array is undefined
    args: [props.value, props.id, [mockPythUpdateDataArray]],

    value: 1,
    onSuccess(data) {
      console.log("Success", data.result);
    },
  });
  console.log("orderCloseIsError is in error", orderCloseIsError);
  console.log("orderCloseConfig is:", orderCloseConfig);
  console.log("orderClosePrepareData is: ", orderClosePrepareData);
  console.log("Order close prepare status", orderClosePrepareStatus);
  console.log("orderClose error is close: ", orderCloseError);
  const {
    data: orderCloseData,
    error: orderCloseWriteError,
    isSuccess: orderCloseSuccess,
    isLoading: orderCloseIsLoading,
    status: orderCloseWriteStatus,
    write: orderClose,
  } = useContractWrite(orderCloseConfig);
  console.log("Order Close write data 1245", orderCloseData);
  console.log("order close write is loading: ", orderCloseIsLoading);
  console.log("write order close error is: ", orderCloseWriteError);
  console.log("Order close write status is: ", orderCloseWriteStatus);

  const closeTradeHandler = async (event) => {
    console.log("From CloseTrade", props.value, props.id);
    props.closeUserTrade(orderCloseConfig);

    setOrderLoading(true);
    setTimeout(() => {
      setOrderLoading(false);
      console.log("market Order timed Out after 10 seconds");
    }, 10000);
    const pythPriceService = new EvmPriceServiceConnection(
      "https://xc-testnet.pyth.network"
    );
    const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
      "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
    ]);
    const pythUpdateFee = await readContract({
      address: pythNetwork.address,
      abi: pythNetworkAbi.abi,
      functionName: "getUpdateFee",
      args: [priceFeedUpdateData],
    });
    //const collateral = await parseEther?.(props.collateral);

    const prepareMarketOrderConfig = await prepareWriteContract({
      address: orderBook.address,
      abi: orderBook.abi,
      functionName: "marketOrder",
      args: [
        props.pairIndex,
        parseEther?.(props.collateral),
        parseUnits?.(props.leverage, 6),
        props.orderType,
        priceFeedUpdateData,
      ],
      value: pythUpdateFee,
    }).catch((err) => setOrderLoading(false));

    const marketOrderHash = await writeContract(prepareMarketOrderConfig).catch(
      (err) => setOrderLoading(false)
    );

    if (marketOrderHash != undefined) {
      setOrderLoading(false);
    }
  };

  return (
    <>
      {orderCloseData && (
        <TradeModal
          mainMessage={"Successfully closed a trade"}
          buttonMessage={"Shut it down!!"}
        ></TradeModal>
      )}

      <div
        className="hover:cursor-pointer text-blue-500 hover:text-red-500"
        onClick={() => orderClose?.()}
        value={props.value}
      >
        CloseTrade
      </div>
    </>
  );
}

export default CloseTrade;
