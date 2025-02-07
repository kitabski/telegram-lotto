import { db } from "./firebaseSetup.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

/**
 * Загружает билет по ID из Firebase и рендерит его в 6x9 таблицу.
 * @param {string} ticketId - ID билета в базе.
 * @param {string} containerId - ID элемента, куда рендерить билет.
 */
export async function loadTicket(ticketId, containerId) {
    try {
        const ticketRef = doc(db, "tickets", ticketId);
        const ticketSnap = await getDoc(ticketRef);

        if (!ticketSnap.exists()) {
            console.error(`Билет с ID ${ticketId} не найден!`);
            return;
        }

        const ticketData = ticketSnap.data().numbers; // Получаем массив чисел
        if (!Array.isArray(ticketData) || ticketData.length !== 54) {
            console.error("Некорректный формат данных билета.");
            return;
        }

        renderTicket(ticketData, containerId, ticketId);
    } catch (error) {
        console.error("Ошибка загрузки билета:", error);
    }
}

/**
 * Рендерит массив чисел в виде 6x9 таблицы.
 */
function renderTicket(ticketData, containerId, ticketId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер с ID ${containerId} не найден!`);
        return;
    }

    container.innerHTML = ""; // Очищаем контейнер перед вставкой нового билета

    // Основной блок билета (рамка)
    const ticketWrapper = document.createElement("div");
    ticketWrapper.classList.add("ticket-wrapper");

    // Заголовок "Билет #"
    const ticketHeader = document.createElement("div");
    ticketHeader.classList.add("ticket-header");
    ticketHeader.innerText = `Билет #${ticketId}`;
    ticketWrapper.appendChild(ticketHeader);

    // Функция для создания таблицы 3x9
    function createTable(startIndex) {
        const table = document.createElement("table");
        table.classList.add("ticket-table");

        for (let row = 0; row < 3; row++) {
            const tr = document.createElement("tr");
            for (let col = 0; col < 9; col++) {
                const td = document.createElement("td");
                const value = ticketData[startIndex + row * 9 + col];

                td.innerText = value !== null ? value : "";
                td.classList.add(value !== null ? "filled" : "empty");
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        return table;
    }

    // Добавляем первую таблицу (первые 27 чисел)
    ticketWrapper.appendChild(createTable(0));

    // Разделитель между таблицами
    const spacer = document.createElement("div");
    spacer.classList.add("table-spacer");
    ticketWrapper.appendChild(spacer);

    // Добавляем вторую таблицу (оставшиеся 27 чисел)
    ticketWrapper.appendChild(createTable(27));

    // Добавляем билет в контейнер
    container.appendChild(ticketWrapper);
}



