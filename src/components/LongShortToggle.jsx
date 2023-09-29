import React from "react";

function LongShortToggle(props) {
  return (
    <div className=" rounded-lg shadow-sm grid grid-cols-2">
      <button
        type="button"
        value={0}
        onClick={props.toggle}
        className={`${
          props.orderType == 0 ? "bg-green-500" : "bg-gray-600"
        } p-2 h-10 flex justify-center rounded-lg mr-1`}
      >
        Long
      </button>
      <button
        type="button"
        value={1}
        className={`${
          props.orderType == 1 ? "bg-red-700" : "bg-gray-600"
        } p-2 h-10 rounded-lg flex justify-center`}
        onClick={props.toggle}
      >
        Short
      </button>
    </div>
  );
}

export default LongShortToggle;
