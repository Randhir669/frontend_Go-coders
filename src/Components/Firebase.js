import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfr7up74omfQ0G0kAm7wJE1afkk0kxxis",
  authDomain: "gocoders-auth.firebaseapp.com",
  projectId: "gocoders-auth",
  storageBucket: "gocoders-auth.appspot.com",
  messagingSenderId: "580363060986",
  appId: "1:580363060986:web:4680d22f9485c2d28dab43",
  measurementId: "G-ZMEWM1BV5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {auth,provider};