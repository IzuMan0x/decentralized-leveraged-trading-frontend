import React from "react";
import {
  usePrepareContractWrite,
  useContractRead,
  useContractWrite,
} from "wagmi";
import mockPythContractAbi from "../assets/mock-pyth-abi.json";
import orderBookAbi from "../assets/OrderBook.json";
//This setup worked at least once 🧐

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
const pythPriceAddress = "0x8464135c8f25da09e49bc8782676a84730c318bc";

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

  const closeTradeHandler = (event) => {
    console.log("From CloseTrade", props.value, props.id);
    props.closeUserTrade(orderCloseConfig);
  };

  return (
    <div
      className="hover:cursor-pointer text-blue-500 hover:text-red-500"
      onClick={() => orderClose?.()}
      value={props.value}
    >
      CloseTrade
    </div>
  );
}

export default CloseTrade;
