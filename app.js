// Глобальные переменные
let ticket = [];
let generatedNumbers = [];
let intervalId = null;
const generationInterval = 1000; // Интервал генерации чисел (мс)

// Элементы DOM
const ticketNumberInput = document.getElementById("ticket-number");
const loadTicketButton = document.getElementById("load-ticket");
const ticketContainer = document.getElementById("ticket");
const startGameButton = document.getElementById("start-game");
const generatedNumbersContainer = document.getElementById("generated-numbers");
const numberGrid = document.getElementById("number-grid");
const ticketTitle = document.getElementById("ticket-title");

// Создание таблицы 10x10
function createNumberGrid() {
    numberGrid.innerHTML = "";
    for (let i = 1; i <= 90; i++) {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = i;
        div.id = `number-${i}`;
        numberGrid.appendChild(div);
    }
}

// Загрузка билетов из файла
async function loadTicket(ticketNumber) {
    try {
        const response = await fetch("tickets.txt");
        const data = await response.text();

        // Разделяем билеты по строкам
        const tickets = data.trim().split("\n").map(line =>
            line.split(",").map(cell => (cell.trim() === "_" ? null : parseInt(cell.trim())))
        );

        // Проверяем корректность номера билета
        if (ticketNumber < 1 || ticketNumber > tickets.length) {
            alert(`Некорректный номер билета! Укажите число от 1 до ${tickets.length}.`);
            return;
        }

        // Преобразуем выбранный билет в 9x3 матрицу
        const selectedTicket = tickets[ticketNumber - 1];
        ticket = [];
        for (let i = 0; i < 3; i++) {
            ticket.push(selectedTicket.slice(i * 9, (i + 1) * 9));
        }

        renderTicket();
        ticketTitle.innerText = `Ваш Билет (№${ticketNumber})`; // Обновляем заголовок
        startGameButton.disabled = false; // Разрешаем начать игру
        createNumberGrid(); // Создаём таблицу 10x10
    } catch (error) {
        alert("Ошибка загрузки билета!");
    }
}

// Отображение билета
function renderTicket() {
    ticketContainer.innerHTML = "";
    ticket.flat().forEach(cell => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = cell || ""; // Пустые ячейки остаются пустыми
        ticketContainer.appendChild(div);
    });
}

// Генерация числа
function generateNumber() {
    if (generatedNumbers.length >= 90) {
        alert("Все числа сгенерированы!");
        clearInterval(intervalId);
        return;
    }

    let number;
    do {
        number = Math.floor(Math.random() * 90) + 1;
    } while (generatedNumbers.includes(number));
    generatedNumbers.push(number);
    renderGeneratedNumbers();
    markNumber(number);
}

// Отображение всех сгенерированных чисел
function renderGeneratedNumbers() {
    generatedNumbersContainer.innerHTML = "";
    generatedNumbers.forEach(num => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = num;
        generatedNumbersContainer.appendChild(div);
    });
}

// Пометка совпадений на билете и в таблице
function markNumber(number) {
    const cells = document.querySelectorAll(".ticket .cell");
    ticket.flat().forEach((cell, index) => {
        if (cell === number) {
            cells[index].classList.add("marked");
        }
    });

    // Окрашивание числа в таблице 10x10
    const gridCell = document.getElementById(`number-${number}`);
    if (gridCell) {
        gridCell.classList.add("red");
    }

    // Проверка выигрыша
    if (ticket.flat().filter(n => n !== null).every(n => generatedNumbers.includes(n))) {
        alert("🏆 Вы выиграли!");
        clearInterval(intervalId);
    }
}

// События
loadTicketButton.addEventListener("click", () => {
    const ticketNumber = parseInt(ticketNumberInput.value);
    loadTicket(ticketNumber);
});

startGameButton.addEventListener("click", () => {
    generatedNumbers = [];
    renderGeneratedNumbers();
    intervalId = setInterval(generateNumber, generationInterval);
});
