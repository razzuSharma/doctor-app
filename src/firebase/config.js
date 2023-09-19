// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDArUDMUPrUnY6BpNOif5C-08Dba4UhPzc",
  authDomain: "healthcaregrz.firebaseapp.com",
  projectId: "healthcaregrz",
  storageBucket: "healthcaregrz.appspot.com",
  messagingSenderId: "1020051476927",
  appId: "1:1020051476927:web:242d030aceaa0cb6dd910a",
  measurementId: "G-NFMSS33NVN",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
export { firebase, authentication };
