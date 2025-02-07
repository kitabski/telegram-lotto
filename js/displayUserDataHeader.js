import { db } from "./firebaseSetup.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Функция для обновления ID, баланса и билетов из Firestore
async function updateHeader() {
    let tg = window.Telegram.WebApp;
    tg.ready();

    let user = tg.initDataUnsafe?.user;
    if (!user) {
        document.getElementById("player-id").innerText = "...";
        document.getElementById("header-balance").innerText = "...";
        document.getElementById("header-tickets").innerText = "...";
        return;
    }

    try {
        const userRef = doc(db, "users", String(user.id));
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();

            // ✅ Обновляем данные только из Firestore!
            document.getElementById("player-id").innerText = `@${data.username}`;
            document.getElementById("header-balance").innerText = `${data.balance}`;
            document.getElementById("header-tickets").innerText = `${data.tickets}`;
        } else {
            // Если пользователя нет в базе, показываем 0
            document.getElementById("player-id").innerText = "...";
            document.getElementById("header-balance").innerText = "...";
            document.getElementById("header-tickets").innerText = "...";
        }
    } catch (error) {
        document.getElementById("player-id").innerText = "Ошибка";
        document.getElementById("header-balance").innerText = "Ошибка";
        document.getElementById("header-tickets").innerText = "Ошибка";
    }
}

// Вызываем обновление шапки при загрузке страницы
document.addEventListener("DOMContentLoaded", updateHeader);
