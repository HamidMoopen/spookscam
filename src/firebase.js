import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCZJPUqNuf_c-njMVqMorDesyy2czE3_jw",
    authDomain: "hackunt-6942d.firebaseapp.com",
    databaseURL: "https://hackunt-6942d-default-rtdb.firebaseio.com",
    projectId: "hackunt-6942d",
    storageBucket: "hackunt-6942d.appspot.com",
    messagingSenderId: "220991056898",
    appId: "1:220991056898:web:408fa48f37c3b7bdd68b1b",
    measurementId: "G-WRWR8PG8K2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };