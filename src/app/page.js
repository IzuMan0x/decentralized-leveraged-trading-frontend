"use client";
import React from "react";
import { motion } from "framer-motion";

import StarsCanvas from "@/components/canvas/Stars";
import TypeWriter from "@/components/TypeWriter";
import Footer from "@/components/Footer";
import Link from "next/link";

function HomePage() {
  return (
    <>
      <div className="relative z-0">
        <StarsCanvas />
        <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden z-0">
          <div className="w-screen h-screen">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2 }}
                className="mt-10 flex justify-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
              >
                BetterTrade.me
              </motion.h1>
              <motion.div
                className="flex justify-center items-center box-border my-10 h-32 w-full"
                initial={{ opacity: 0, scale: 10 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2 }}
              >
                <TypeWriter></TypeWriter>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: +50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2 }}
            >
              <Link
                href="/trading"
                className="hover:cursor-pointer z-10 m-10 text-black flex justify-center bg-gradient-to-r from-white to-gray-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-700 dark:focus:ring-yellow-700 font-medium rounded-full text-auto p-10 text-center mr-6 mb-6"
              >
                Enter App
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default HomePage;
