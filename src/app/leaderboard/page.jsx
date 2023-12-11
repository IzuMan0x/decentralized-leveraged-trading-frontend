import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LeaderBoard from "@/app/leaderboard/LeaderBoard";
import { getStandings } from "@/lib/firebase/firebaseDatabase.js";
import { Suspense, cache } from "react";

async function Page() {
  const standings = await getStandings();
  console.log(standings);

  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
        <div></div>
        <Suspense fallback={<div className="text-white">Loading....</div>}>
          <LeaderBoard standings={standings} />
        </Suspense>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Page;
