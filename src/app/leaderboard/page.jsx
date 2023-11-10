import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LeaderBoard from "./LeaderBoard";
import {
  ref,
  child,
  get,
  query,
  orderByChild,
  orderByValue,
  onValue,
} from "firebase/database";
import { getDatabaseInstance } from "@/lib/firebase/firebaseDatabase.js";
import { Suspense, cache } from "react";

async function Page() {
  /* const filterStandings = async (dbRef)={

  } */
  const standingsData = async () => {
    const firebaseDb = await getDatabaseInstance();

    const dbRef = ref(firebaseDb, "/standings");

    const queryRef = query(dbRef, orderByChild("payouts"));

    /*  return await onValue(
      queryRef,
      (snapshot) => {
        const dataArray = [];

        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot.val());
          dataArray.push(childSnapshot.val());
        });
      },
      { onlyOnce: true }
    ); */
    const dataArray = [];
    let counter = 0;
    const numberOfResults = 5;
    const standingsArray = (await get(queryRef)).forEach((snapshot) => {
      //dataArray.push(snapshot.val());
      if (snapshot.val() == undefined || counter >= numberOfResults) {
        return true;
      }
      const standingsObject = { [snapshot.key]: snapshot.val() };
      dataArray.push(standingsObject);
      console.log("parent snapshot is:", snapshot.val());
      snapshot.forEach((childSnapshot) => {
        //console.log(childSnapshot.val());
        //dataArray.push(childSnapshot.val());
        counter++;
        if (counter >= numberOfResults) {
          return true;
        }
      });
    });

    console.log(
      "From the page:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ",
      standingsArray,
      counter
    );
    if (standingsArray === true) {
      return dataArray;
    } else if (standingsArray === false) {
      setTimeout(() => {
        console.log("The timer has kicked in");
        return dataArray;
      }, 3000);
      console.log("something went wrong");
    }

    // This will return all the data without filtering or ordering
    /*  const snapshot = await get(child(dbRef, "/"));

    if (snapshot.exists()) {
      //console.log("from the leaderboards", snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
    } */
  };

  const standings = await standingsData();
  console.log("the standings are: ", standings);

  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
        <div></div>
        <LeaderBoard standings={standings} />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Page;
