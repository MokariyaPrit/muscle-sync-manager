
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCN3UzaALhZmLZNXYuZFz8Piln30zRtIa0",
  authDomain: "gym-management-system-486a3.firebaseapp.com",
  projectId: "gym-management-system-486a3",
  storageBucket: "gym-management-system-486a3.firebasestorage.app",
  messagingSenderId: "24178859785",
  appId: "1:24178859785:web:2f58e9af7b52e148c57dd8",
  measurementId: "G-X4Q4N6VS7R"
};

// console.log("Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };
