"use client";
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LeaderBoard from "./LeaderBoard";
import { useAccount } from "wagmi";

function Page() {
  //connnected wallets address
  const { address } = useAccount();
  console.log(address);
  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
        <LeaderBoard></LeaderBoard>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Page;
