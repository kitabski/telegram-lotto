

import { db } from "./firebaseSetup.js"; // Подключаем Firebase
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


console.log("Telegram Web App API доступен:", window.Telegram?.WebApp);


// Функция для обновления ID и баланса в шапке
async function updateHeader() {
    const telegramId = localStorage.getItem("telegramId");

    // Проверяем, есть ли сохранённый Telegram ID
    if (!telegramId) {
        document.getElementById("player-id").innerText = "Неизвестен";
        document.getElementById("header-balance").innerText = "0";
        return;
    }

    // Отображаем Telegram ID
    document.getElementById("player-id").innerText = telegramId;

    try {
        // Получаем текущий баланс из Firestore
        const userRef = doc(db, "users", telegramId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const balance = userSnap.data().balance;
            document.getElementById("header-balance").innerText = balance;
        } else {
            document.getElementById("header-balance").innerText = "0";
        }
    } catch (error) {
        console.error("Ошибка при получении баланса:", error.message || error);
        document.getElementById("header-balance").innerText = "Ошибка";
    }
}

// Вызываем обновление шапки при загрузке страницы
document.addEventListener("DOMContentLoaded", updateHeader);






// Функция для пополнения баланса
async function topUpBalance(amount) {
    const telegramId = localStorage.getItem("telegramId");
    if (!telegramId || amount <= 0) {
        alert("Telegram ID не найден или некорректная сумма!");
        return;
    }

    try {
        const userRef = doc(db, "users", telegramId);
        await updateDoc(userRef, {
            balance: increment(amount),
        });
        alert(`Баланс успешно пополнен на ${amount}!`);
        updateHeader(); // Обновляем шапку
    } catch (error) {
        console.error("Ошибка пополнения:", error.message || error);
        alert("Ошибка при пополнении баланса: " + (error.message || error));
    }
}

// Функция для снятия баланса
async function withdrawBalance(amount) {
    const telegramId = localStorage.getItem("telegramId");
    if (!telegramId || amount <= 0) {
        alert("Telegram ID не найден или некорректная сумма!");
        return;
    }

    try {
        const userRef = doc(db, "users", telegramId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("Пользователь не найден!");
            return;
        }

        const currentBalance = userSnap.data().balance;
        if (currentBalance < amount) {
            alert("Недостаточно средств на балансе!");
            return;
        }

        await updateDoc(userRef, {
            balance: increment(-amount),
        });
        alert(`С баланса снято ${amount}!`);
        updateHeader(); // Обновляем шапку
    } catch (error) {
        console.error("Ошибка снятия:", error.message || error);
        alert("Ошибка при снятии баланса: " + (error.message || error));
    }
}

// Обработчики для кнопок
document.getElementById("recharge-button").addEventListener("click", () => {
    const amount = parseFloat(prompt("Введите сумму для пополнения:"));
    topUpBalance(amount);
});

document.getElementById("withdraw-button").addEventListener("click", () => {
    const amount = parseFloat(prompt("Введите сумму для снятия:"));
    withdrawBalance(amount);
});

