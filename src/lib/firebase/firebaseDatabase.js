import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  limitToFirst,
  limitToLast,
  query,
  orderByChild,
} from "firebase/database"; // Import the Firebase Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBehsXijQJKUA2GXzaJv1HpDGXUMVhd2ow",
  authDomain: "bettertrade-standings.firebaseapp.com",
  projectId: "bettertrade-standings",
  storageBucket: "bettertrade-standings.appspot.com",
  messagingSenderId: "348051431739",
  appId: "1:348051431739:web:920d9882b40f469448171e",
  measurementId: "G-T63LXH8FD7",
  databaseURL:
    "https://bettertrade-standings-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
let _app;
let _database;
const initFirebase = () => {
  if (_app) {
    console.log("firebase database has already been initialized");
    return;
  }

  _app = initializeApp(firebaseConfig);
  _database = getDatabase(_app);
};

//Getter function so we can use the instance of the database in other parts of the application
export const getDatabaseInstance = () => {
  if (!_app) {
    console.log("initializing firebase!!");
    initFirebase();
  }
  return _database;
};

//Getter for firebase app;
export const getAppInstance = () => {
  if (!_app) {
    console.log("initializing firebase!!");
    initFirebase();
  }
  return _app;
};

//exports

//module.exports = getDatabaseInstance;
//exports.initFirebase = initFirebase;

const onValueArray = [];
const onValueDb = await getDatabaseInstance();
const onValueDbRef = ref(onValueDb, "/standings");
const onValueRef = query(onValueDbRef, orderByChild("payouts"), limitToLast(5));
onValue(onValueRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    //console.log("the childrens snapshot is: ", childSnapshot.val());
    const standingsObject = { [childSnapshot.key]: childSnapshot.val() };

    onValueArray.push(standingsObject);
  });

  //console.log("the data from snapshot is: ", onValueArray);
});

const standingsPromise = new Promise((resolve, reject) => {
  console.log("starting timer 3");
  const retryNumber = 5;
  let counter = 0;

  const checkForData = () => {
    setTimeout(() => {
      if (counter >= retryNumber) {
        reject("Data could not be fetched");
      } else if (onValueArray.length === 0) {
        counter++;
        checkForData();
      } else if (onValueArray.length >= 1) {
        resolve(onValueArray);
      }
      console.log("promise3");
    }, 1000);
  };

  if (onValueArray.length === 0) {
    checkForData();
  }
});

export const getStandings = async () => {
  return await standingsPromise;
};
/*   if (getStandingsCounter >= 3) {
    return "Data not Found in the database";
  }
  if (onValueArray.length === 0) {
    const timer = setTimeout(() => {
      getStandingsCounter++;
      console.log("from the lib file the data is undefined");
      getStandings();
    }, 5000);
  } else if (onValueArray.length != 0) {
    return onValueArray;
  } */
