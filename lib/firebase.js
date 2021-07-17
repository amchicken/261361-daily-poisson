import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfzOBVdGL7kxlXH57NKnh7PJ3lS8SrXtA",
  authDomain: "daliy-poisson.firebaseapp.com",
  projectId: "daliy-poisson",
  storageBucket: "daliy-poisson.appspot.com",
  messagingSenderId: "97146809748",
  appId: "1:97146809748:web:2e83a7fcd2af8430e33381",
};

if (!firebase.apps.length > 0) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
