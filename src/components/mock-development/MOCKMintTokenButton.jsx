import erc20MockAbi from "../../assets/ERC20Mock-abi.json";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { parseEther, formatUnits, parseUnits } from "viem";
import orderBookAbi from "../../assets/OrderBook.json";
import React from "react";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

function MOCKMintTokenButton(props) {
  const erc20Mock = {
    abi: erc20MockAbi.abi,
    address: props.tokenAddress,
  };
  const { address, isConnected } = useAccount();

  //mint erc20 token for testing
  //This is just for test purposes to mint collateral so we can interact with the contract
  const {
    config: mintConfig,
    data: prepareMintData,
    error: mintError,
    isError: mintErrorBool,
    isLoading: prepareMintIsLoading,
    status: prepareMintStatus,
  } = usePrepareContractWrite({
    address: erc20Mock.address,
    abi: erc20Mock.abi,
    functionName: "mint",
    args: [address, parseEther("100000")],
    onSuccess(data) {
      console.log(
        "Success prepare contract write mint erc20 mock",
        data.result
      );
    },
  });
  console.log("Prepare erc20 mint data is: ", prepareMintData);
  console.log("Prepare erc20 mint  error is: ", prepareMintIsLoading);
  console.log("the orderbook address is:", orderBook.address);

  const {
    data: mintData,
    isSuccess: mintIsSuccess,
    isLoading: mintIsLoading,
    write: mint,
  } = useContractWrite(mintConfig);
  console.log("mint is loading", mintIsLoading);
  return (
    <div className="justify-center flex">
      <button
        className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => mint?.()}
        type="button"
      >
        Mint Test Collateral
      </button>
    </div>
  );
}

export default MOCKMintTokenButton;
