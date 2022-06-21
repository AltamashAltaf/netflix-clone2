import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyDoQM_SnL2Qk7CCIgl6k1owtuqiucq1s9A",
  authDomain: "netflix-clone2-e542d.firebaseapp.com",
  projectId: "netflix-clone2-e542d",
  storageBucket: "netflix-clone2-e542d.appspot.com",
  messagingSenderId: "1014871693493",
  appId: "1:1014871693493:web:59f64903f0bab0e19b06fc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
                              
export{auth};
export default db;

