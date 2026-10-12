// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDB2emrX7zWKufY5Mo2OaLYwyVkRJmOmlw",
	authDomain: "drstethos-app.firebaseapp.com",
	projectId: "drstethos-app",
	storageBucket: "drstethos-app.firebasestorage.app",
	messagingSenderId: "508211938902",
	appId: "1:508211938902:web:68a03d743a7b6ca1d05df7",
	measurementId: "G-0DS5Q9B9Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, "asia-south1");

export { app, analytics, auth, db, functions };
