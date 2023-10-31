import React from "react";

import { useAssetList, useUpdateAssetList } from "./DropDownListContext";

const pairIndexArray = [0, 1, 2, 3, 4];
const pairSymbolsArray = [
  "$ETH/USD",
  "$BTC/USD",
  "$XRP/USD",
  "$MATIC/USD",
  "$BNB/USD",
];

function DropDownSelector(props) {
  const hider = props.hideAssetList;
  //console.log("from the selector", hider);

  const assetListVisible = useAssetList();
  const updateAssetListVisability = useUpdateAssetList();

  const hideListHandler = () => {
    props.hideAssetList(!props.isAssetListHidden);
  };
  console.log("from the selector", props.isAssetListHidden);
  return (
    <div className="relative w-full h-full">
      <button
        id="dropdownSearchButton"
        className="z-100 text-white my-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => updateAssetListVisability(!assetListVisible)}
      >
        {props.selectedAssetSymbol === undefined ||
        props.selectedAssetSymbol === 0
          ? "Select Asset Pair"
          : `Selected Pair: ${props.selectedAssetSymbol}`}
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        id="dropdownSearch"
        className={`z-10 ${
          assetListVisible ? "hidden" : undefined
        } bg-white rounded-lg shadow w-60 dark:bg-gray-700 absolute`}
      >
        <ul
          className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {pairIndexArray.map((pairIndex) => {
            return (
              <li key={pairIndex}>
                <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    checked={props.selectedAsset == pairIndex}
                    id="checkbox-item-11"
                    type="checkbox"
                    value={pairIndex}
                    onClick={props.selectedAssetHandler}
                    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                  />
                  <label
                    for="checkbox-item-11"
                    class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    {`${pairSymbolsArray[pairIndex]}`}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DropDownSelector;
