import React, { useState } from "react";
import orderBookAbi from "@/assets/OrderBook.json";

import { parseEther, parseUnits } from "viem";
import mockPythContractAbi from "@/assets/mock-pyth-abi.json";

import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
const mockPythNetwork = {
  abi: mockPythContractAbi.abi,
  address: process.env.NEXT_PUBLIC_PYTH_CONTRACT_ADDRESS,
};

//interacting with the MOCK pyth address
//these price ID's are created when we inititially deply the mock contract
//note price ID's need to be in string format
const ETH_PRICE_ID =
  "0x000000000000000000000000000000000000000000000000000000000000abcd";
const BTC_PRICE_ID =
  "0x0000000000000000000000000000000000000000000000000000000000001234";
const ethPrice = 900;
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

function OpenTradeButton(props) {
  const [orderLoading, setOrderLoading] = useState(false);

  const openTradeHandler = async () => {
    const collateral = props.collateral.toString();
    const leverage = props.leverage.toString();
    console.log("collateral", props.collateral);
    console.log("Leverage", props.leverage);
    console.log("orderType", props.orderType);
    console.log("pairIndex", props.pairIndex);
    setOrderLoading(true);
    setTimeout(() => {
      setOrderLoading(false);
      console.log("market Order timed Out after 10 seconds");
    }, 10000);
    const mockPythAddress = await readContract({
      address: orderBook.address,
      abi: orderBook.abi,
      functionName: "getPythPriceFeedAddress",
    });
    const mockPythUpdateArray = await readContract({
      address: mockPythAddress,
      abi: mockPythNetwork.abi,
      args: mockPythArgsArray,
      functionName: "createPriceFeedUpdateData",

      onSuccess(data) {
        console.log("Success on getting mock pyth update data", data);
      },
    });

    console.log("pythupdate data is: ", mockPythUpdateArray);

    const prepareMarketOrderConfig = await prepareWriteContract({
      address: orderBook.address,
      abi: orderBook.abi,
      functionName: "marketOrder",
      args: [
        props.pairIndex,
        parseEther(collateral),
        parseUnits(leverage, 6),
        props.orderType,
        [mockPythUpdateArray],
      ],
      chainId: 31337,
      value: 1,
    }).catch((err) => {
      setOrderLoading(false);
      console.log("prepare marketOrder error is:", err);
    });

    const marketOrderHash = await writeContract(prepareMarketOrderConfig).catch(
      (err) => {
        setOrderLoading(false);
        console.log("marketOrder error is this:", err);
      }
    );
    /* 
    if (marketOrderHash != undefined) {
      setOrderLoading(false);
    } */
  };

  return (
    <>
      {orderLoading ? (
        <button
          disabled
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            class="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      ) : (
        <button
          type="button"
          onClick={openTradeHandler}
          className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Market Order
        </button>
      )}
    </>
  );
}

export default OpenTradeButton;

//Maybe we should read the address when dealing with mocks so we dont have to deal with setting the env file
/*works
  //getting the priceFeed address from the OrderBook contract
  const {
    data: pythPriceFeedAddress,
    error: getPythPriceFeedAddressError,
    isLoading: getPythPriceFeedAddressIsLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    args: [],
    functionName: "getPythPriceFeedAddress",

    onSuccess(data) {
      console.log("Success on getting pyth feed address", data);
    },
  });
  //console.log("Pyth address is: ", pythPriceFeedAddress);
  //console.log("Pyth address error is: ", getPythPriceFeedAddressError);
 */
