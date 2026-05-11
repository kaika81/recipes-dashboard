import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACTDh2MxhqD1zts2YQ-zfUYe6q2Q2H6y4",
  authDomain: "recipes-96205.firebaseapp.com",
  projectId: "recipes-96205",
  storageBucket: "recipes-96205.firebasestorage.app",
  messagingSenderId: "900817869544",
  appId: "1:900817869544:web:6a563c218c08989033f1f3"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.firebaseDb = db;
window.firebaseCollection = collection;
window.firebaseGetDocs = getDocs;

window.dispatchEvent(new Event("firebaseReady"));
