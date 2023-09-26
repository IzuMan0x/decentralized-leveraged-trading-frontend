import React from "react";

function TradingPoints() {
  return (
    <div>
      <h2 class="mb-2 text-lg font-semibold text-gray-300 dark:text-white">
        Trading Restrictions:
      </h2>
      <ul class="max-w-md space-y-1 text-gray-400 list-disc list-inside">
        <li>Trade positon size must be over $1500 (Leverage x Collateral)</li>
        <li>Max leverage is 150x</li>
        <li>Opening fee is 0.75% and based off the total trade size.</li>
      </ul>
      <h2 class="mb-2 text-lg font-semibold text-gray-300 dark:text-white">
        Testing Phase:
      </h2>
      <ul class="max-w-md space-y-1 text-gray-400 list-disc list-inside">
        <li>
          Mint test Collateral using Etherscan (see the notice at the top of the
          page)!! 😜
        </li>
        <li>Please report any bugs in the Discord Channel</li>
        <li>Thank you for your support!! 🙏🏻</li>
      </ul>
    </div>
  );
}

export default TradingPoints;
