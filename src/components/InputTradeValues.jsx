"use client";
import React, { useState } from "react";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { parseEther, formatUnits, parseUnits } from "viem";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
//production
import orderBookAbi from "../assets/OrderBook.json";
import pythNetworkAbi from "../assets/pythnetwork-abi.json";
import erc20Abi from "../assets/ERC20-abi.json";

import { PriceTicker } from "./PythPriceText";
import LongShortToggle from "./LongShortToggle";
import TradeModal from "./TradeModal";
import OpenTradeModal from "./OpenTradeModal";
import DropDownSelector from "./DropDownSelector";
import ApproveTokenButton from "./buttons/ApproveTokenButton";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Web3Button } from "@web3modal/react";
import OpenTradeButton from "./buttons/OpenTradeButton";
import TradeDetails from "./TradeDetails";

//note we need to prefix the env variables with NEXT_PUBLIC to use them on the browser side
const orderBook = {
  address: process.env.NEXT_PUBLIC_ORDER_BOOK_CONTRACT_ADDRESS,
  abi: orderBookAbi,
};
//orderBookContractAddress
const pythNetwork = {
  abi: pythNetworkAbi,
  address: process.env.NEXT_PUBLIC_PYTH_CONTRACT_ADDRESS,
};
const collateralTokenAddress = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS;

const tradingViewArray = ["ETHUSD", "BTCUSD", "XRPUSD", "MATICUSD", "BNBUSD"];
const openFeePercentage = 0.00075;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//React component
function InputTradeValues(props) {
  const [orderType, setOrderType] = useState(0);
  const [orderArgs, setOrderArgs] = useState({
    pairIndex: -1,
    amountCollateral: 0,
    leverage: 0,
    orderType: -1,
    pythData: ["something"],
  });
  const [prepareContract, setPrepareContract] = useState(false);
  const [tradeModalCheck, setTradeModalCheck] = useState(false);
  const [priceFeedUpdateData, setPriceFeedUpdateData] = useState([]);
  const { address, isConnected } = useAccount();
  const [tokenAllowance, setTokenAllowance] = useState();
  const [collateralInput, setCollateralInput] = useState(0);
  const [leverageAmount, setLeverageAmount] = useState();
  const [assetListHidden, setAssetListHidden] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("Nothing");
  const mounted = useIsMounted();

  ////////////////////////////////////////////////////////////////////
  //Functions for Testing the Contract Intereacting with Mocks etc.///
  ////////////////////////////////////////////////////////////////////

  //Here we are retrieving the token collateral address
  // for production this may just be an .env variable

  const {
    data: contractTokenAllowance,
    error: contractTokenAllowanceError,
    isLoading: contractTokenAllowanceIsLoading,
  } = useContractRead({
    address: collateralTokenAddress,
    abi: erc20Abi.abi,
    args: [address, orderBook.address],
    functionName: "allowance",

    onSuccess(data) {
      setTokenAllowance(formatUnits(data, 18));
    },
  });

  const toggleOrderTypeHandler = (event) => {
    setOrderType(event.target.value);

    //console.log("ordertype is: ", orderType);
  };

  ////////////////////
  // Contract Writes//
  ///////////////////

  /* const {
    config: approveTokenConfig,
    data: prepapreApproveToken,
    error: approveTokenError,
    isLoading: prepareApproveTokenIsLoading,
  } = usePrepareContractWrite({
    address: collateralTokenAddress,
    abi: erc20Abi.abi,
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
  } = useContractWrite(approveTokenConfig); */

  //Long and short toggle
  const initiateTradeHandler = async (event) => {
    event.preventDefault();
    if (prepareContract == false) {
      const pythPriceService = new EvmPriceServiceConnection(
        "https://xc-testnet.pyth.network"
      );
      const priceFeedUpdateData =
        await pythPriceService.getPriceFeedsUpdateData([
          "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
        ]);
      const pythUpdateFee = await readContract({
        address: pythNetwork.address,
        abi: pythNetworkAbi.abi,
        functionName: "getUpdateFee",
        args: [priceFeedUpdateData],
      });
      let orderTypeArgs;
      setOrderType((prev) => {
        orderTypeArgs = prev;
        return prev;
      });
      //Collateral is 1e18 which is the same as ethereum
      const collateral = parseEther(event.target.collateral.value);
      //leverage is 1e6
      const leverage = parseUnits(event.target.leverage.value, 6);
      //const pythCallData = [mockPythUpdateDataArray];
      //This needs to be set by the user
      const pairIndex = selectedAsset;

      setOrderArgs([
        pairIndex,
        collateral,
        leverage,
        orderTypeArgs,
        priceFeedUpdateData,
        pythUpdateFee,
      ]);

      console.log("The submitted orderType is: ", orderTypeArgs);
      setTradeModalCheck(true);
    } else {
      //marketOrder?.();
    }

    //marketOrder?.();
  };

  const closeTradeModal = () => {
    setTradeModalCheck(false);
  };

  const toggleAssetPairListHandler = () => {
    setAssetListHidden(() => !assetListHidden);
  };
  const closeAssetDropDownListHandler = () => {
    setAssetListHidden(true);
  };

  const selectedAssetHandler = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedAssetSymbol(tradingViewArray[event.target.value]);
    props.assetChange(tradingViewArray[event.target.value], event.target.value);
    setAssetListHidden(true);
    console.log("Selected Asset is: ", event.target.value);
  };

  return (
    <div>
      {/* {marketOrderSuccess ? setModal(true) : ""} */}
      {false && (
        <TradeModal
          mainMessage={"Trade Successfully Opened!!!"}
          buttonMessage={"Well done"}
        />
      )}
      {tradeModalCheck &&
        false(
          <OpenTradeModal
            mainMessage={`Trade Parameters are:`}
            buttonMessage={"Confirm Trade"}
            orderArgs={orderArgs}
            closeModal={closeTradeModal}
          ></OpenTradeModal>
        )}
      {mounted && (
        <form onSubmit={initiateTradeHandler}>
          <div className="grid gap-2 mb-1 md:grid-cols-2">
            <div className="col-span-2 my-2">
              <LongShortToggle
                toggle={toggleOrderTypeHandler}
                orderType={orderType}
              ></LongShortToggle>
            </div>

            <div>
              <label className="text-sm font-medium text-white">
                Selected Trading Pair
              </label>
              <div className="col-span-2 flex w-full">
                <DropDownSelector
                  toggleAssetPairList={toggleAssetPairListHandler}
                  selectedAsset={selectedAsset}
                  selectedAssetSymbol={selectedAssetSymbol}
                  selectedAssetHandler={selectedAssetHandler}
                  dropDownListHidden={assetListHidden}
                  hideList={closeAssetDropDownListHandler}
                />
              </div>
            </div>

            <div>
              <label
                for="collateral_amount"
                className="block mb-2 text-sm font-medium text-white"
              >
                Collateral Amount
              </label>
              <input
                type="number"
                min={10}
                id="collateral_amount"
                name="collateral"
                className="flex -webkit-appearance:none -moz-appearance:textfield my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="150"
                required
                value={collateralInput}
                onChange={(event) => setCollateralInput(event.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="leverage_amount"
                className="block mb-2 text-sm font-medium text-white"
              >
                Leverage Amount
              </label>
              <input
                type="number"
                id="leverage_amount"
                min={1}
                max={150}
                value={leverageAmount}
                onChange={(event) => {
                  setLeverageAmount(event.target.value);
                }}
                pattern="\d{3}"
                name="leverage"
                className="bg-gray-50 border my-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1 to 150"
                required
              />
            </div>
          </div>
          {isConnected == false ? (
            <div className="bg-red-700 text-center items-center p-2 rounded-lg hover:bg-red-900">
              <Web3Button />
            </div>
          ) : tokenAllowance == 0 ||
            Number(tokenAllowance) < collateralInput ? (
            <ApproveTokenButton />
          ) : (
            <OpenTradeButton
              leverage={leverageAmount}
              collateral={collateralInput}
              orderType={orderType}
              pairIndex={selectedAsset}
            />
          )}
        </form>
      )}

      <TradeDetails
        orderType={orderType}
        selectedAsset={selectedAsset}
        collateral={collateralInput}
        leverage={leverageAmount}
      />
    </div>
  );
}

export default InputTradeValues;

{
  /* <div className="flex text-white mx-10 border-solid border-4 border-white px-6 py-3 my-4">
<h1 className="text-white flex-shrink">
  Estimated Execution Price:
  <PriceTicker
    estimateTradeOpenPrice={selectedAsset}
    orderType={orderType}
  ></PriceTicker>
</h1>
<h1 className="text-red-500 flex shrink">
  {`Opening Fee is: 
  ${currencyFormat.format(
    collateralInput * leverageAmount * openFeePercentage
  )}`}
</h1>
</div> */
}
