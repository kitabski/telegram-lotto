import.meta.env;
// Вставьте сюда конфигурацию из Firebase Console
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "kitloto.firebaseapp.com",
    databaseURL: "https://kitloto-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kitloto",
    storageBucket: "kitloto.firebasestorage.app",
    messagingSenderId: "1012349888084",
    appId: "1:1012349888084:web:8c0061d74e281a1079efc1"
};

// Экспортируем конфигурацию как `default`
export default firebaseConfig;