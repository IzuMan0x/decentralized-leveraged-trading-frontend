import React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import orderBookAbi from "@/assets/OrderBook.json";
import erc20Mock from "@/assets/ERC20Mock-abi.json";

const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

function MOCKApproveTokenButton(props) {
  const collateralToken = {
    address: props.tokenAddress,
    abi: erc20Mock.abi,
  };

  const {
    config: approveTokenConfig,
    data: prepareApproveTokenData,
    error: approveTokenError,
    isLoading: prepareApproveTokenIsLoading,
  } = usePrepareContractWrite({
    address: collateralToken.address,
    abi: collateralToken.abi,
    functionName: "approve",
    args: [orderBook.address, 2 ** (256 - 1)],
    onSuccess(data) {
      console.log("Success prepare contract write approve token", data.result);
    },
  });
  console.log("Approve token error is: ", approveTokenError);
  const {
    data: approveTokenData,
    isSuccess: approveTokenSuccess,
    isLoading: approveTokenIsLoading,
    write: approve,
  } = useContractWrite(approveTokenConfig);
  return (
    <div>
      MOCKApproveTokenButton
      <button
        type="button"
        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={() => {
          approve?.();
        }}
      >
        Approve
      </button>
    </div>
  );
}

export default MOCKApproveTokenButton;
