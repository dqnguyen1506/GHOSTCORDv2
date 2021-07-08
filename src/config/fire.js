import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/storage");
require("firebase/auth");

export const config = {
    apiKey: "AIzaSyDAXitXP9GjahZswsIl-fJdizqSUHcNNgc",
    authDomain: "test-f53fb.firebaseapp.com",
    databaseURL: "https://test-f53fb.firebaseio.com",
    projectId: "test-f53fb",
    storageBucket: "test-f53fb.appspot.com",
    messagingSenderId: "240769697941",
    appId: "1:240769697941:web:b0a2348b3d14850313739c",
    measurementId: "G-7236ZR4T5X"  
};

const fire = firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.storage();
export default fire;
