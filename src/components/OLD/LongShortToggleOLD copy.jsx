import React from "react";

function LongShortToggle(props) {
  //console.log("LongShortToggle: ", props.orderType);
  return (
    <div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onClick={props.toggle}
        />
        <div
          className={`w-14 h-7 ${
            props.orderType == 0
              ? "bg-green-600 dark:bg-green-600 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"
              : " after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all  peer-checked:bg-red-600"
          } dark:border-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] `}
        ></div>
        <span className="ml-3 text-sm font-medium text-white">
          {props.orderType == 0 ? "Long" : "Short"}
        </span>
      </label>
    </div>
  );
}

export default LongShortToggle;
