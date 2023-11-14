import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function LimitStrikePrice(props) {
  const onChangeHandler = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      props.limitPriceChangeHandler(event.target.value);
    }
  };
  return (
    <AnimatePresence>
      <motion.div>
        <label className="relative cursor-pointer">
          <input
            type="text"
            placeholder={0}
            id="collateral_amount"
            name="collateral"
            className="h-20 w-96 px-6 text-4xl text-white bg-black border-white border-2 rounded-lg border-opacity-50 outline-none focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            required
            value={props.limitPrice}
            onChange={onChangeHandler}
          />
          <span className=" text-5xl text-white text-opacity-80 bg-black absolute left-5 px-1 bottom-0 transition duration-200 input-text">
            Limit Price
          </span>
        </label>
      </motion.div>
    </AnimatePresence>
  );
}

export default LimitStrikePrice;

//flex my-4 bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
