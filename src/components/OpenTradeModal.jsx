import React, { useState } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import orderBookAbi from "../assets/OrderBook.json";
import { formatUnits } from "viem";
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
const assetSymbolArray = [
  "ETH/USD",
  "BTC/USD",
  "XRP/USD",
  "MATIC/USD",
  "BNB/USD",
];
const orderTypesArray = ["Long", "Short"];

function TradeModal(props) {
  const [modal, setModal] = useState(true);

  const {
    config: marketOrderConfig,
    data: prepareMarketOrderData,
    error: marketOrderError,
    isError: errorBool,
    isLoading: prepareMarketOrderIsLoading,
    status,
  } = usePrepareContractWrite({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "marketOrder",
    args: [
      props.orderArgs[0],
      props.orderArgs[1],
      props.orderArgs[2],
      props.orderArgs[3],
      props.orderArgs[4],
    ],
    value: props.orderArgs[5], //getUpdateFeeData,
    onSuccess(data) {
      console.log("Success prepare contract write marketOrder", data.result);
    },
  });

  //console.log("The prepare marketOrder data: ", prepareMarketOrderData);
  /* console.log(
    "The prepare marketOrder is loading:",
    prepareMarketOrderIsLoading
  ); */
  console.log("The prepare marketOrder is in error: ", marketOrderError);
  //console.log("The prepare marketOrder is in error: ", errorBool);
  //console.log("The prepare marketOrder status ", status);

  const {
    data: marketOrderData,
    isSuccess: marketOrderSuccess,
    isLoading: marketOrderIsLoading,
    write: marketOrder,
    status: marketOrderStatus,
  } = useContractWrite(marketOrderConfig);

  const openTradeHandler = () => {
    marketOrder?.();

    console.log("Trade should be opened now");
  };
  return (
    <div>
      <div className=" w-full h-full" onClick={props.closeModal}>
        <div className="fixed h-32 w-32 flex justify-center">
          <div
            id="popup-modal"
            tabindex="-1"
            className="fixed right-10 z-100 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div class="relative w-full max-w-md max-h-full">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  onClick={props.closeModal}
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                  <svg
                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {props.mainMessage}
                  </h3>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {`✅ Trading pair is: ${
                      assetSymbolArray[props.orderArgs[0]]
                    }`}
                    <ul className="max-w-md space-y-1 text-gray-400 list-disc list-inside">
                      <li>{`Collateral: $${formatUnits(
                        props.orderArgs[1],
                        18
                      )}`}</li>
                      <li>{`Leverage: ${formatUnits(
                        props.orderArgs[2],
                        6
                      )}`}</li>
                      <li>{`Order Type: ${
                        orderTypesArray[props.orderArgs[3]]
                      }`}</li>
                    </ul>
                  </h3>

                  <button
                    onClick={openTradeHandler}
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    {props.buttonMessage}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeModal;
