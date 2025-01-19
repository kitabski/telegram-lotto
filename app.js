// Глобальные переменные
let ticket = []; // Хранит текущий билет
let generatedNumbers = []; // Хранит список сгенерированных чисел
let intervalId = null; // Идентификатор интервала для анимации чисел
const generationInterval = 1000; // Интервал между генерацией чисел (мс)
const animationDuration = 1000; // Длительность анимации (мс)
const delayAfterNumber = 1000; // Задержка после выбора числа (мс)

// Элементы DOM
const buyTicketButton = document.getElementById("buy-ticket"); // Кнопка "Купить билет"
const ticketModal = document.getElementById("ticket-modal"); // Всплывающее окно
const selectTicketButton = document.getElementById("select-ticket"); // Кнопка "Выбрать билет"
const randomTicketButton = document.getElementById("random-ticket"); // Кнопка "Случайный билет"
const ticketContainer = document.getElementById("ticket"); // Контейнер для билета
const startGameButton = document.getElementById("start-game"); // Кнопка "Начать игру"
const animatedNumber = document.getElementById("animated-number"); // Анимация текущего числа
const numberGrid = document.getElementById("number-grid"); // Сетка чисел

/**
 * Создает сетку чисел 10x10 (числа от 1 до 90).
 */
function createNumberGrid() {
    numberGrid.innerHTML = ""; // Очищаем старую сетку
    for (let i = 1; i <= 90; i++) {
        const div = document.createElement("div");
        div.className = "cell"; // Стиль ячейки
        div.innerText = i; // Число
        div.id = `number-${i}`; // Уникальный идентификатор ячейки
        numberGrid.appendChild(div); // Добавляем ячейку в сетку
    }
}

/**
 * Загружает билет по номеру из файла tickets.txt.
 * @param {number} ticketNumber - Номер выбранного билета.
 */
async function loadTicket(ticketNumber) {
    try {
        const response = await fetch("tickets.txt"); // Загружаем файл
        const data = await response.text(); // Читаем содержимое файла

        // Преобразуем данные билетов
        const tickets = data.trim().split("\n").map(line =>
            line.split(",").map(cell => (cell.trim() === "_" ? null : parseInt(cell.trim())))
        );

        // Проверяем корректность номера билета
        if (ticketNumber < 1 || ticketNumber > tickets.length) {
            showModal("Ошибка", `Некорректный номер билета! Укажите число от 1 до ${tickets.length}.`);
            return;
        }

        // Преобразуем выбранный билет в 9x3 матрицу
        const selectedTicket = tickets[ticketNumber - 1];
        ticket = [];
        for (let i = 0; i < 3; i++) {
            ticket.push(selectedTicket.slice(i * 9, (i + 1) * 9));
        }

        renderTicket(ticketNumber); // Отображаем билет
        startGameButton.disabled = false; // Активируем кнопку "Начать игру"
        createNumberGrid(); // Создаем сетку чисел
    } catch (error) {
        showModal("Ошибка", "Ошибка загрузки билета!"); // Пользовательское окно
    }
}

/**
 * Отображает текущий билет.
 * @param {number} ticketNumber - Номер билета.
 */
function renderTicket(ticketNumber) {
    ticketContainer.innerHTML = ""; // Очищаем старый билет
    ticket.flat().forEach(cell => {
        const div = document.createElement("div");
        div.className = "cell"; // Стиль ячейки
        div.innerText = cell || ""; // Если ячейка пустая
        ticketContainer.appendChild(div); // Добавляем ячейку в контейнер
    });

    // Добавляем номер билета в правом верхнем углу
    const ticketNumberLabel = document.createElement("div");
    ticketNumberLabel.style.position = "absolute";
    ticketNumberLabel.style.top = "5px";
    ticketNumberLabel.style.right = "10px";
    ticketNumberLabel.style.fontSize = "12px";
    ticketNumberLabel.style.fontWeight = "bold";
    ticketNumberLabel.innerText = `#${ticketNumber}`;
    ticketContainer.appendChild(ticketNumberLabel);
}

/**
 * Генерирует число с анимацией.
 */
async function generateNumber() {
    if (generatedNumbers.length >= 90) {
        showModal("Конец игры", "Все числа сгенерированы!");
        resetGame(); // Возвращаем игру в начальное состояние
        return;
    }

    let randomAnimationInterval;

    // Анимация смены чисел
    randomAnimationInterval = setInterval(() => {
        const random = Math.floor(Math.random() * 90) + 1; // Случайное число
        animatedNumber.innerText = random; // Отображаем число
    }, 50); // Интервал смены чисел

    await new Promise(resolve => setTimeout(resolve, animationDuration)); // Ждем 1 секунду

    clearInterval(randomAnimationInterval); // Останавливаем анимацию

    // Генерируем финальное число
    let number;
    do {
        number = Math.floor(Math.random() * 90) + 1;
    } while (generatedNumbers.includes(number));

    generatedNumbers.push(number); // Добавляем число в список
    animatedNumber.innerText = number; // Отображаем финальное число

    markNumber(number); // Отмечаем число на билете и в сетке

    await new Promise(resolve => setTimeout(resolve, delayAfterNumber)); // Задержка перед следующим числом
}

/**
 * Помечает совпавшие числа на билете и в сетке.
 * @param {number} number - Число для пометки.
 */
function markNumber(number) {
    const cells = document.querySelectorAll(".ticket .cell");
    ticket.flat().forEach((cell, index) => {
        if (cell === number) {
            cells[index].classList.add("marked"); // Помечаем ячейку
        }
    });

    const gridCell = document.getElementById(`number-${number}`);
    if (gridCell) {
        gridCell.classList.add("red"); // Помечаем ячейку в сетке
    }

    if (ticket.flat().filter(n => n !== null).every(n => generatedNumbers.includes(n))) {
        showModal("Вы выиграли!", "Поздравляем, вы выиграли!");
        resetGame(); // Сбрасываем игру
    }
}

/**
 * Показывает пользовательское модальное окно.
 * @param {string} title - Заголовок окна.
 * @param {string} message - Сообщение.
 */
function showModal(title, message) {
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerHTML = `<h3>${title}</h3><p>${message}</p><button id="close-modal">Закрыть</button>`;
    ticketModal.innerHTML = "";
    ticketModal.appendChild(modalContent);
    ticketModal.style.display = "flex";

    document.getElementById("close-modal").addEventListener("click", () => {
        ticketModal.style.display = "none";
    });
}

/**
 * Сбрасывает игру в начальное состояние.
 */
function resetGame() {
    clearInterval(intervalId);
    intervalId = null;
    generatedNumbers = [];
    animatedNumber.innerText = "-";
    startGameButton.disabled = true;
    buyTicketButton.style.display = "inline-block";
    startGameButton.style.display = "inline-block";
}

// События для кнопок
buyTicketButton.addEventListener("click", () => {
    ticketModal.style.display = "flex"; // Показываем всплывающее окно
});

selectTicketButton.addEventListener("click", () => {
    const ticketNumber = parseInt(prompt("Введите номер билета:"));
    if (!isNaN(ticketNumber)) {
        loadTicket(ticketNumber); // Загружаем выбранный билет
        ticketModal.style.display = "none"; // Закрываем окно
    }
});

randomTicketButton.addEventListener("click", () => {
    const ticketNumber = Math.floor(Math.random() * 3) + 1; // Генерируем случайный номер билета
    loadTicket(ticketNumber);
    ticketModal.style.display = "none"; // Закрываем окно
});

startGameButton.addEventListener("click", () => {
    buyTicketButton.style.display = "none"; // Скрываем кнопки
    startGameButton.style.display = "none";

    if (generatedNumbers.length === 0) {
        createNumberGrid(); // Очищаем сетку чисел
        animatedNumber.innerText = "-"; // Сбрасываем анимацию
        generatedNumbers = []; // Очищаем список чисел
    }

    if (!intervalId) {
        intervalId = setInterval(generateNumber, generationInterval + animationDuration + delayAfterNumber); // Запускаем игру
    }
});
