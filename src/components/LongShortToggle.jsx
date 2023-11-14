import React from "react";

function LongShortToggle(props) {
  return (
    <div className=" rounded-lg shadow-sm grid grid-cols-2">
      <button
        type="button"
        value={0}
        onClick={props.toggle}
        className={`${
          props.orderType == 0
            ? "transition ease-in-out delay-100 duration-200 hover:translate-y-1 bg-green-500 text-white"
            : "transition ease-in-out delay-150 duration-300 bg-gray-600 "
        } p-2 h-10 flex justify-center rounded-lg m-1`}
      >
        Long
      </button>
      <button
        type="button"
        value={1}
        className={`${
          props.orderType == 1
            ? "transition ease-in-out delay-100 duration-200 hover:translate-y-1 bg-red-700 text-white"
            : "bg-gray-600"
        } p-2 h-10 rounded-lg flex justify-center m-1`}
        onClick={props.toggle}
      >
        Short
      </button>
    </div>
  );
}

export default LongShortToggle;
