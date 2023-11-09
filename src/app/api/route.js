import { headers } from "next/headers";
import { ref, child, get } from "firebase/database";
import { getDatabaseInstance } from "@/lib/firebase/firebaseDatabase.js";

export async function GET(req, res) {
  const headersList = headers();
  const referer = headersList.get("referer");

  const standingsData = async () => {
    const firebaseDb = await getDatabaseInstance();
    const dbRef = ref(firebaseDb);
    const standings = await get(child(dbRef, `standings`))
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
    return standings;
  };

  const standingsResults = await standingsData();

  return Response.json({ standingsResults });

  /*   return res.json({
    status: 200,
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: standingsResults,
  }); */
}
