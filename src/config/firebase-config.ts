import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "datingapp-8e4ad.firebaseapp.com",
  databaseURL: "https://datingapp-8e4ad-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "datingapp-8e4ad",
  storageBucket: "datingapp-8e4ad.appspot.com",
  messagingSenderId: "236486004044",
  appId: "1:236486004044:web:6214713ecaf82db10f53e9",
  measurementId: "G-PF8FLKKR21"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);