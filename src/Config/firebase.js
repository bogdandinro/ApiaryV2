import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  child,
  remove,
} from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEmRXXLkeaig-UHZMhtKEteDUZyb51Ag8",
  authDomain: "apiary-df95d.firebaseapp.com",
  projectId: "apiary-df95d",
  storageBucket: "apiary-df95d.appspot.com",
  messagingSenderId: "646424538467",
  appId: "1:646424538467:web:bb15efb452571013423756",
  measurementId: "G-2V07R1RTPF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth();

export {
  app,
  analytics,
  db,
  ref,
  set,
  child,
  push,
  onValue,
  remove,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
