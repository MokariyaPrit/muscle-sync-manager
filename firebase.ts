// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN3UzaALhZmLZNXYuZFz8Piln30zRtIa0",
  authDomain: "gym-management-system-486a3.firebaseapp.com",
  projectId: "gym-management-system-486a3",
  storageBucket: "gym-management-system-486a3.firebasestorage.app",
  messagingSenderId: "24178859785",
  appId: "1:24178859785:web:2f58e9af7b52e148c57dd8",
  measurementId: "G-X4Q4N6VS7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);