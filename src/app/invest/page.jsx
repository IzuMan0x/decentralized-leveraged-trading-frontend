"use client";
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

function Investing() {
  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
        <div>
          <h1 className="text-white text-6xl justify-center flex py-10">
            $BTR Token
          </h1>
        </div>
        <div>
          <h1 className="text-white text-4xl justify-center flex py-10">
            Coming soon!
          </h1>
        </div>
        <div>
          <h1 className="text-white text-4xl justify-center flex py-10"></h1>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Investing;
