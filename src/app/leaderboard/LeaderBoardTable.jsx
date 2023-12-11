"use client";
import React, { useState } from "react";

function LeaderBoardTable(props) {
  const address = props.address;

  const [copied, setCopied] = useState(false);
  return (
    <tbody className="rounded-full relative">
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          <div>
            {props.address}
            <span className="inline-block ">
              {" "}
              <abbr title="Copy Address">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mx-2 hover:text-blue-500 hover:cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" />
                </svg>
              </abbr>
              {copied && (
                <div className="ml-5 p-1 absolute top-0 right-[-6] border border-solid bg-slate-500 rounded-full text-xs">
                  Copied!
                </div>
              )}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">{props.totalTrades}</td>

        <td className="px-6 py-4">{props.winnings}</td>
      </tr>
    </tbody>
  );
}

export default LeaderBoardTable;
