"use client";
import React from "react";
import { useEffect, useState } from "react";

//there are tow types of useRouters
import { usePathname } from "next/navigation";
import LeaderBoardTable from "./LeaderBoardTable";

const url = "http://localhost:8080/trader-data";
//"https://udemy-react-course-backend-default-rtdb.firebaseio.com/standings.json"
let componentDidMount = false;

function LeaderBoard() {
  const [leaderboardData, setLeaderBoardData] = useState({});
  const [dataLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    const fetchData = async () => {
      if (!componentDidMount) {
        setIsLoading(true);
      }

      console.log("the fetch data function was called!!!", pathname);
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Could not fetch leaderboard data!!");
      }
      const data = await response.json();
      setLeaderBoardData(await data.standings);
      setIsLoading(false);
    };
    fetchData();
    componentDidMount = true;
    //We are updating the data every 5 seconds
    timer = setInterval(fetchData, 5000);

    //This is a cleanup function for the data fetch and the setInterval
    return () => {
      controller.abort;
      clearInterval(timer);
    };
  }, []);

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

          {!dataLoading &&
            Object.keys(leaderboardData).map((key, index) => {
              console.log("made it here", key.totalTradeSize);
              return (
                <LeaderBoardTable
                  key={key}
                  address={key}
                  totalTrades={leaderboardData[key].totalTradeCount}
                  totalTradesSize={leaderboardData[key].collateralSupplied}
                  winnings={leaderboardData[key].payouts}
                ></LeaderBoardTable>
              );
            })}
        </table>
        {dataLoading && (
          <div className="text-white justify-center flex text-lg">
            Loading....
          </div>
        )}
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
