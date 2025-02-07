import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Инициализируем Firestore
const db = getFirestore(app);

export { app, db };
