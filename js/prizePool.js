import { db } from "./firebaseSetup.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

async function loadPrizePool() {
    const prizeRef = doc(db, "game_data", "prize_pool");
    try {
        const prizeSnapshot = await getDoc(prizeRef);
        if (prizeSnapshot.exists()) {
            const data = prizeSnapshot.data();
            document.getElementById("round1").textContent = data.round1 || 0;
            document.getElementById("round2").textContent = data.round2 || 0;
            document.getElementById("round3").textContent = data.round3 || 0;
        } else {
            console.error("Призовой фонд не найден!");
        }
    } catch (error) {
        console.error("Ошибка загрузки призового фонда:", error);
    }
}

// Загружаем призовой фонд при загрузке страницы
document.addEventListener("DOMContentLoaded", loadPrizePool);
