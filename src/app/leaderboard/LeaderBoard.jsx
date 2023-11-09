import React from "react";

import LeaderBoardTable from "./LeaderBoardTable";

function LeaderBoard({ standings }) {
  console.log("from the leaderboard compoent", standings);
  return (
    <>
      <div>
        <h1 className="text-white text-6xl justify-center flex py-10">
          LeaderBoards
        </h1>
      </div>

      <div className="relative overflow-x-auto m-10 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Number of Trades
              </th>
              <th scope="col" className="px-6 py-3">
                Total Trade Value
              </th>
              <th scope="col" className="px-6 py-3">
                Winnings
              </th>
            </tr>
          </thead>

          {standings.map((val, index) => {
            //console.log("made it here", key.totalTradeSize);
            const keyArray = Object.keys(val);
            const userAddress = keyArray[0];

            console.log("from the table list: ", val[userAddress].payouts);
            return (
              <LeaderBoardTable
                key={userAddress}
                address={userAddress}
                totalTrades={val[userAddress].totalTradeCount}
                totalTradesSize={"placeholder"}
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

/* leaderboardData.standings.map((user, index) => {
    console.log(item);
    return (
      
    );
  }) */
