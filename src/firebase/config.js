// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuzYqeJ6T6WnBO2oi0OCzL5vt1RrK574w",
  authDomain: "doctorap-a163a.firebaseapp.com",
  projectId: "doctorap-a163a",
  storageBucket: "doctorap-a163a.appspot.com",
  messagingSenderId: "831773389899",
  appId: "1:831773389899:web:0402c9ffe4801bf9c149ce",
  measurementId: "G-TJL4DM7EKY",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
export { firebase, authentication };



// ios = "399353246920-633rv0ng9i34t945dvbf8afth6cm65h7.apps.googleusercontent.com"
// android = "399353246920-m2aaht1pg4ptof9mglftidg2ldgef37i.apps.googleusercontent.com"