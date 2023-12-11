import React from "react";

function TradingNumberInput(props) {
  const onChangeHandler = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      props.changeHandler(event.target.value);
    }
  };
  return (
    <div className="my-5">
      <label className="relative cursor-pointer">
        <input
          type="text"
          placeholder="0"
          id={props.id}
          name={props.name}
          className="h-20 flex px-6 text-l text-white bg-black border-white border-2 rounded-lg border-opacity-50 outline-none focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
          required
          value={props.value}
          onChange={onChangeHandler}
        />
        <span className="text-xl text-white text-opacity-80 bg-black absolute left-5 px-0 bottom-6 transition duration-200 input-text">
          {props.text}
        </span>
      </label>
    </div>
  );
}

export default TradingNumberInput;
