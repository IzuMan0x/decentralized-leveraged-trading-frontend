import React from "react";
import { ref, child, get } from "firebase/database";
import { getDatabaseInstance } from "@/lib/firebase/firebaseDatabase.js";

async function Layout({ children }) {
  let standingsData;
  () => console.log("this loaded");
  const firebaseDb = await getDatabaseInstance();
  const dbRef = ref(firebaseDb);

  get(child(dbRef, `standings`))
    .then((snapshot) => {
      standingsData = snapshot.val();
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  // Example: Read data from Firebase Realtime Database

  /*  const databaseRef = database.ref("/your_data_path"); // Set the path to the data you want to read
    databaseRef.on("value", (snapshot) => {
      const data = snapshot.val(); // Retrieve the data
      console.log("Data from Firebase:", data);
    }); */

  return <div>{children}</div>;
}

export default Layout;
