//import firebase from 'firebase/app';
import * as firebase from 'firebase/app'
//import { initializeApp, getApps } from 'firebase/app';
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyAcjiv3MxWrkUh8cMjlBt4v4XFuiJ4P0F4",
    authDomain: "authuser-31a1c.firebaseapp.com",
    projectId: "authuser-31a1c",
    storageBucket: "authuser-31a1c.appspot.com",
    messagingSenderId: "749837642803",
    appId: "1:749837642803:web:c48e96178c1efabad20746"

}
//console.log("firebase started")
/*firebase.initializeApp({
    apiKey: "AIzaSyCUDNGu61LCRar4kbRbu6ZyFX9H9kXcvEo",
    authDomain: "fir-react-3bc66.firebaseapp.com",
    projectId: "fir-react-3bc66",


});*/
const app = initializeApp(firebaseConfig);



export default firebase; 