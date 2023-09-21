"use client";
import React, { useEffect, useState } from "react";
import StarsCanvas from "@/components/canvas/Stars";
import TypeWriter from "../components/TypeWriter";
import Footer from "@/components/Footer";

function HomePage() {
  return (
    <>
      <div className="relative z-0">
        <StarsCanvas />
        <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden z-0">
          <div className="w-screen h-screen">
            <div>
              <h1 className="text-white text-6xl justify-center flex py-6">
                BetterTrade.me
              </h1>
              <div class=" flex justify-center items-center box-border h-64 w-full">
                <TypeWriter></TypeWriter>
              </div>
            </div>
            <div className="flex justify-center">
              <a
                href="/trading"
                className="hover:cursor-pointer z-10 m-10 text-white flex justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-6xl p-10 text-center mr-6 mb-6"
              >
                Enter App
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default HomePage;
