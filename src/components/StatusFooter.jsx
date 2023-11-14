import React from "react";

function StatusFooter() {
  return (
    <>
      <div className="fixed bottom-0 animate-pulse">
        <div
          class="flex items-center p-1 text-sm bg-black  text-red-400"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="red"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>

          <abbr
            title="Tradings Bots are not
            running"
          >
            Status
          </abbr>
        </div>
      </div>
    </>
  );
}

export default StatusFooter;
