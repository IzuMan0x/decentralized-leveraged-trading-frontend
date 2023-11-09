import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LeaderBoard from "./LeaderBoard";
import { ref, child, get } from "firebase/database";
import { getDatabaseInstance } from "@/lib/firebase/firebaseDatabase.js";
import { Suspense, cache } from "react";

const standingsData = async () => {
  const firebaseDb = await getDatabaseInstance();
  const dbRef = ref(firebaseDb);
  get(child(dbRef, `standings`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("from the page", snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

async function Page() {
  //let standingsData;
  () => console.log("this loaded");

  const standings = cache(standingsData());

  //const [standings] = await Promise.all([standingsData]);
  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
        {!(await standingsData()) ? (
          <p className="text-white">loading....</p>
        ) : (
          <LeaderBoard standings={await standingsData()}></LeaderBoard>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Page;
