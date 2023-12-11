import React from "react";
import LeaderBoardTable from "@/app/leaderboard/LeaderBoardTable";

function LeaderBoard({ standings }) {
  return (
    <>
      <div>
        <h1 className="text-white text-6xl justify-center flex py-10">
          LeaderBoards
        </h1>
      </div>

      <div className="relative m-10 overflow-auto rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
            <tr>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Number of Trades
              </th>

              <th scope="col" className="px-6 py-3">
                Net Winnings
              </th>
            </tr>
          </thead>

          {standings.reverse().map((val, index) => {
            const keyArray = Object.keys(val);
            const userAddress = keyArray[0];
            return (
              <LeaderBoardTable
                key={userAddress}
                address={userAddress}
                totalTrades={val[userAddress].totalTradeCount}
                winnings={val[userAddress].payouts}
              ></LeaderBoardTable>
            );
          })}
        </table>
      </div>
    </>
  );
}

export default LeaderBoard;
