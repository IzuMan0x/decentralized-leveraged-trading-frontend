import React from "react";
//This setup worked at least once 🧐

function CloseTrade(props) {
  const closeTradeHandler = (event) => {
    console.log("From CloseTrade", props.pairIndex, props.id);
    props.closeUserTrade(props.id, props.value);
  };
  return (
    <div onClick={closeTradeHandler} value={props.value}>
      CloseTrade
    </div>
  );
}

export default CloseTrade;
