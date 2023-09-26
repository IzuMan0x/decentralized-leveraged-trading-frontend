import React from "react";

function NotificationBar() {
  return (
    <>
      <div>
        {" "}
        <div
          class="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-500 dark:text-red-400 shadow-slate-600"
          role="alert"
        >
          <svg
            class="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span class="sr-only">Info</span>
          <div>
            <span class="font-medium">Notice!</span> We are working on fixing
            the webpage design. If accesing this page on mobile please use
            desktop mode to make the experience more enjoyable.
          </div>
        </div>
      </div>

      <div>
        {" "}
        <div
          class="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-500 dark:text-red-400 shadow-slate-600"
          role="alert"
        >
          <svg
            class="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span class="sr-only">Info</span>
          <a
            href="https://sepolia.etherscan.io/token/0x40a945CC51F76e1409584242fec3ccAbE2402e88#writeContract"
            target="_blank"
          >
            <span class="font-medium">Notice!</span> You can mint test tokens
            HERE. Just connect your wallet and write to the "mint" function the
            amount of tokens you would like to mint!
          </a>
        </div>
      </div>
    </>
  );
}

export default NotificationBar;
