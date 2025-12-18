// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8XRnDK3yiPV2QSGDJHd0-UzIBIly2UT0",
  authDomain: "embroidery-ae062.firebaseapp.com",
  projectId: "embroidery-ae062",
  storageBucket: "embroidery-ae062.firebasestorage.app",
  messagingSenderId: "178721675738",
  appId: "1:178721675738:web:8640a8b03fdb89106e08e3",
  measurementId: "G-X69FP624Q3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Provider for use in AuthContext
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
