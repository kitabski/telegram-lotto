import { db } from "./firebaseSetup.js"; // Импорт Firestore
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; // Функции для работы с Firestore

// Функция для регистрации пользователя
async function registerUser(telegramId) {
    if (!telegramId) {
        alert("Telegram ID не может быть пустым!");
        return;
    }

    try {
        // Проверяем, существует ли пользователь
        const userRef = doc(db, "users", telegramId); // Ссылка на документ пользователя
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            alert("Пользователь уже зарегистрирован!");
            return;
        }

        // Создаем нового пользователя
        await setDoc(userRef, {
            telegramId: telegramId,
            balance: 0, // Начальный баланс
            createdAt: new Date().toISOString(), // Время регистрации
        });

        // Сохраняем Telegram ID в Local Storage
        localStorage.setItem("telegramId", telegramId);
        alert("Регистрация успешна! Telegram ID сохранён.");
    } catch (error) {
        console.error("Ошибка регистрации:", error.message || error);
        alert("Ошибка при регистрации: " + (error.message || error));
    }
}

// Обработчик кнопки регистрации
document.getElementById("register").addEventListener("click", () => {
    const telegramId = document.getElementById("telegramId").value;
    console.log("Нажата кнопка регистрации, Telegram ID:", telegramId); // Лог для проверки
    registerUser(telegramId);
});
