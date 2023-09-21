import React, { useEffect, useState } from "react";
import { useContractReads, useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { formatUnits } from "viem";
import orderBookAbi from "../assets/OrderBook.json";
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

const baseBorrowFee = 0.00006;

function TotalShortsBorrowFee(props) {
  //+ formatUnits?.(data[3]?.result, 7)

  const {
    data: borrowFeeRate,
    isError,
    isLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getCurrentBorrowRate",
    args: [props.pairIndex],
    watch: true,
  });
  return (
    <div>{`Shorts Borrow Fee: ${
      borrowFeeRate == undefined || isLoading || isError
        ? "loading... "
        : `%${(
            (-1 * formatUnits?.(borrowFeeRate, 7) + baseBorrowFee) *
            100
          ).toFixed(6)}`
    }/hour`}</div>
  );
}

export default TotalShortsBorrowFee;
