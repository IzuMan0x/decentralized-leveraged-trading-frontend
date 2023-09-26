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

function TotalLongs(props) {
  const {
    data: totalLongs,
    isError,
    isLoading,
  } = useContractRead({
    address: orderBook.address,
    abi: orderBook.abi,
    functionName: "getTotalLongAmount",
    args: [props.pairIndex],
    watch: true,
  });
  return (
    <>
      <div>
        {`Total Longs: ${
          !isError && !isLoading ? (
            currencyFormat?.format(formatUnits(totalLongs, 18))
          ) : (
            <div>NaN</div>
          )
        }`}
      </div>
    </>
  );
}

export default TotalLongs;
