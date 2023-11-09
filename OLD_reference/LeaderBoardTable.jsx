import React from "react";

function LeaderBoardTable(props) {
  return (
    <tbody>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {props.address}
        </th>
        <td className="px-6 py-4">{props.totalTrades}</td>
        <td className="px-6 py-4">{props.totalTradesSize}</td>
        <td className="px-6 py-4">{props.winnings}</td>
      </tr>
    </tbody>
  );
}

export default LeaderBoardTable;
