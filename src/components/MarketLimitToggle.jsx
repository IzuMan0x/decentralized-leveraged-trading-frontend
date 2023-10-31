import React from "react";

function MarketLimitToggle(props) {
  return (
    <div className=" rounded-lg shadow-sm grid grid-cols-2">
      <button
        type="button"
        value="false"
        onClick={props.toggle}
        className={`${
          props.limitOrder == "false" ? "bg-blue-700" : "bg-gray-600"
        } p-2 h-10 flex justify-center rounded-lg mr-1`}
      >
        Market
      </button>
      <button
        type="button"
        value="true"
        className={`${
          props.limitOrder == "true" ? "bg-blue-700" : "bg-gray-600"
        } p-2 h-10 rounded-lg flex justify-center`}
        onClick={props.toggle}
      >
        Limit
      </button>
    </div>
  );
}

export default MarketLimitToggle;
