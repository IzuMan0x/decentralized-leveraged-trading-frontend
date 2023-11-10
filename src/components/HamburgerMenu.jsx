import React from "react";
import Link from "next/link";
import { motion, stagger, useAnimate } from "framer-motion";
import { useHamburgerMenu } from "./HamburgerMenuContext";

const linkListArray = [
  { title: "Trade", url: "/trading", target: "" },
  { title: "LeaderBoards", url: "/leaderboard", target: "" },
  {
    title: "Documentation",
    url: "https://bettertrade-me.gitbook.io/untitled/",
    target: "_blank",
  },
  { title: "Invest", url: "/invest", target: "" },
  {
    title: "Contract",
    url: "https://discord.com/invite/ra4gsDKy7Z",
    target: "_blank",
  },
];

function HamburgerMenu() {
  const menuHidden = useHamburgerMenu();
  const [scope, animate] = useAnimate();

  //console.log(menuHidden);

  const hamburgerIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-10 h-10"
      onClick={() => menuHidden.hideMenu(!menuHidden.state)}
    >
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );

  const linkList = (
    <div className=" block w-auto " id="navbar-default">
      <ul
        ref={scope}
        className=" font-medium block flex-row p-4 mt-4 border border-gray-100 rounded-md bg-gray-50 border-1 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
      >
        {linkListArray.map((item) => {
          return (
            <motion.li
              initial={{ opacity: 0, x: +30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href={item.url}
                className="block row-span-1 py-2 pl-3 pr-4 my-1 text-white bg-blue-700 rounded "
                aria-current="page"
                target={item.target}
              >
                {item.title}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <div>
      {hamburgerIcon}

      <div className="absolute right-0 z-10">
        {!menuHidden?.state && linkList}
      </div>
    </div>
  );
}

export default HamburgerMenu;
