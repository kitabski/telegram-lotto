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

// Загрузка билетов из файла
async function loadTicket(ticketNumber) {
    try {
        const response = await fetch("tickets.txt");
        const data = await response.text();
        const tickets = data.trim().split("\n\n").map(ticket =>
            ticket.split("\n").map(row =>
                row.split(",").map(cell => (cell.trim() === "_" ? null : parseInt(cell.trim())))
            )
        );
        if (ticketNumber > tickets.length || ticketNumber < 1) {
            alert(`Некорректный номер билета! Укажите число от 1 до ${tickets.length}.`);
            return;
        }
        ticket = tickets[ticketNumber - 1];
        renderTicket();
        startGameButton.disabled = false;
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
        div.innerText = cell || "";
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

// Отображение сгенерированных чисел
function renderGeneratedNumbers() {
    generatedNumbersContainer.innerHTML = "";
    generatedNumbers.forEach(num => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = num;
        generatedNumbersContainer.appendChild(div);
    });
}

// Пометка совпадений на билете
function markNumber(number) {
    const cells = document.querySelectorAll(".ticket .cell");
    ticket.flat().forEach((cell, index) => {
        if (cell === number) {
            cells[index].classList.add("marked");
        }
    });
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

