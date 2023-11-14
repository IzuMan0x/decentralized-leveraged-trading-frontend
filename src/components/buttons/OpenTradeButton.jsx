import React, { useState } from "react";
import orderBookAbi from "../../assets/OrderBook.json";
import pythNetworkAbi from "../../assets/pythnetwork-abi.json";
import { parseEther, parseUnits } from "viem";
import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import {
  pythTestPriceFeedIdArray,
  testNetPriceServiceUrl,
} from "@/utils/utils.jsx";

/*  */

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};
const pythNetwork = {
  abi: pythNetworkAbi,
  address: process.env.NEXT_PUBLIC_PYTH_CONTRACT_ADDRESS,
};
const getPythConfig = (chainId, pairIndex) => {
  //contract is live on the sepolia testnet
  if (chainId == 11155111) {
    return {
      url: testNetPriceServiceUrl,
      priceId: pythTestPriceFeedIdArray[pairIndex],
    };
  } else {
    console.log("Mainnet has not been setup up yet");
  }
};

function OpenTradeButton(props) {
  const [orderLoading, setOrderLoading] = useState(false);
  //expect to get the chain id from the props
  console.log("from the open trade button:", props.chainId);
  const pythConfig = getPythConfig(props.chainId, props.pairIndex);

  const openTradeHandler = async () => {
    if (
      props.pairIndex == -1 ||
      props.pairIndex == undefined ||
      props.collateral == 0 ||
      props.leverage == 0 ||
      props.orderType > 1 ||
      props.collateral * props.leverage < 1500
    ) {
      return alert("Error! executing trade please check trade values!! ");
    }

    setOrderLoading(true);
    setTimeout(() => {
      setOrderLoading(false);
      console.log("market Order timed Out after 10 seconds");
    }, 10000);
    const pythPriceService = new EvmPriceServiceConnection(pythConfig.url);
    const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
      pythConfig.priceId,
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
/* const priceIds = [
  // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
  "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id on testnet
  "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", // BTC/USD price id on testnet
  "0xbfaf7739cb6fe3e1c57a0ac08e1d931e9e6062d476fa57804e165ab572b5b621", // XRP/USD price id on testnet
  "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5", // MATIC/USD price id on testnet
  "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", //BNB/USD price id on testnet
]; */
/* const pythPriceService = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
  );
  priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  ]);
  pythUpdateFee = await readContract({
    address: pythNetwork.address,
    abi: pythNetworkAbi.abi,
    functionName: "getUpdateFee",
    args: [priceFeedUpdateData],
  });
  useEffect(() => {}, [props.pairIndex]);

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
      props.pairIndex,
      props.collateral,
      props.leverage,
      props.orderType,
      priceFeedUpdateData,
    ],
    value: pythUpdateFee, //getUpdateFeeData,
    onSuccess(data) {
      console.log("Success prepare contract write marketOrder", data.result);
    },
  });

  const {
    data: marketOrderData,
    isSuccess: marketOrderSuccess,
    isLoading: marketOrderIsLoading,
    write: marketOrder,
    status: marketOrderStatus,
  } = useContractWrite(marketOrderConfig); */
