import React from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import erc20Abi from "@/assets/ERC20-abi.json";

const collateralToken = {
  abi: erc20Abi.abi,
  address: process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS,
};
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
};

function ApproveTokenButton() {
  const {
    config: approveTokenConfig,
    data: prepapreApproveToken,
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
    <button
      type="button"
      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      onClick={() => approve?.()}
    >
      Approve Collateral Token
    </button>
  );
}

export default ApproveTokenButton;
