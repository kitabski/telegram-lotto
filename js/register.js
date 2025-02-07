import { db } from "./firebaseSetup.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    let tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    let user = tg.initDataUnsafe?.user;
    if (!user) {
        document.body.innerHTML += `<p style="color: red;">Ошибка: Данные пользователя отсутствуют.</p>`;
        return;
    }

    let registerButton = document.getElementById("register");
    let modal = document.getElementById("modal");
    let modalMessage = document.getElementById("modal-message");

    if (!registerButton || !modal || !modalMessage) {
        document.body.innerHTML += `<p style="color: red;">Ошибка: Элементы интерфейса не найдены.</p>`;
        return;
    }

    // Проверяем, есть ли пользователь в Firestore
    const userRef = doc(db, "users", String(user.id));
    await new Promise(resolve => setTimeout(resolve, 500));
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        registerButton.style.display = "block"; // Показываем кнопку
    }

    registerButton.addEventListener("click", async () => {
        try {
            modal.style.display = "flex"; // Показываем модальное окно
            modalMessage.innerHTML = `<p style="color: black; font-weight: bold;">Ждите...</p>`;

            let userData = {
                id: user.id,
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                username: user.username || "",
                language_code: user.language_code || "",
                balance: 5000,
                tickets: 0,
                createdAt: new Date().toISOString()
            };

            await setDoc(userRef, userData);

            // ✅ Показываем сообщение об успешной регистрации
            modalMessage.innerHTML = `<p style="color: green; font-weight: bold;">Поздравляем!!!<br>Регистрация прошла успешно!<br>Вам начислено 5000 KitCoin 🎉</p>`;

            setTimeout(() => {
                modal.style.display = "none"; // Закрываем окно через 3 секунды
                location.reload(); // Обновляем страницу
            }, 3000);

            registerButton.style.display = "none"; // Скрываем кнопку
        } catch (error) {
            modalMessage.innerHTML = `<p style="color: red; font-weight: bold;">Ошибка при регистрации!</p>`;
            setTimeout(() => {
                modal.style.display = "none";
            }, 3000);
        }
    });

    // Закрытие модального окна по клику
    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });
});
