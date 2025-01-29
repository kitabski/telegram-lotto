
import firebaseConfig from "./firebaseConfig.js"; // Импортируем конфигурацию Firebase

// Инициализируем Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
console.log("Firebase успешно инициализирован!");

// Инициализация Firestore
const db = getFirestore();
export { db }; // Экспортируем Firestore для использования в других файлах

export default app; // Экспортируем экземпляр Firebase
