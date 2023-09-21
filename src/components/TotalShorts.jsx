import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { formatUnits } from "viem";
import orderBookAbi from "../assets/OrderBook.json";
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi.abi,
};

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function TotalShorts(props) {
  const {
    data: totalShorts,
    isError,
    isLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getTotalShortAmount",
    args: [props.pairIndex],
    watch: true,
  });
  return (
    <>
      {!isError && !isLoading && (
        <div>{`Total Shorts: ${currencyFormat.format(
          formatUnits(totalShorts, 18)
        )}`}</div>
      )}
      {isError && isLoading && <div>Total Shorts: $ 0</div>}
    </>
  );
}

export default TotalShorts;