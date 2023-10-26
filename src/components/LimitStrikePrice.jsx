import React from "react";

function LimitStrikePrice(props) {
  return (
    <>
      {props.limitOrder == "true" ? (
        <div>
          <label className="text-white">Limit Price:</label>
          <input
            type="number"
            min={10}
            id="collateral_amount"
            name="collateral"
            className="flex -webkit-appearance:none -moz-appearance:textfield my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="150"
            required
            value={props.limitPrice}
            onChange={(event) =>
              props.limitPriceChangeHandler(event.target.value)
            }
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default LimitStrikePrice;
