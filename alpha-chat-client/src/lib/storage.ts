import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBhUwXGPbofDxFTtcXJyPvzSGuU06IXAyk",
    authDomain: "alphachat-abcb6.firebaseapp.com",
    projectId: "alphachat-abcb6",
    storageBucket: "alphachat-abcb6.appspot.com",
    messagingSenderId: "560876838843",
    appId: "1:560876838843:web:3fee7d98649352f3236e9e",
    measurementId: "G-8FJ4C8PPP9"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);