import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database"; // Import the Firebase Realtime Database

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
