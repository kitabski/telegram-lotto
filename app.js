// Глобальные переменные
let ticket = [];
let generatedNumbers = [];
let intervalId = null;
const generationInterval = 1000; // Интервал генерации чисел (мс)
const animationDuration = 1000; // Длительность анимации (мс)
const delayAfterNumber = 1000; // Задержка после выпавшего числа (мс)

// Элементы DOM
const ticketNumberInput = document.getElementById("ticket-number");
const loadTicketButton = document.getElementById("load-ticket");
const ticketContainer = document.getElementById("ticket");
const startGameButton = document.getElementById("start-game");
const animatedNumber = document.getElementById("animated-number");
const numberGrid = document.getElementById("number-grid");

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

        renderTicket(ticketNumber);
        startGameButton.disabled = false; // Разрешаем начать игру
        createNumberGrid(); // Создаём таблицу 10x10
    } catch (error) {
        alert("Ошибка загрузки билета!");
    }
}

// Отображение билета
function renderTicket(ticketNumber) {
    ticketContainer.innerHTML = "";
    ticket.flat().forEach(cell => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = cell || ""; // Пустые ячейки остаются пустыми
        ticketContainer.appendChild(div);
    });

    // Добавляем номер билета
    const ticketNumberLabel = document.createElement("div");
    ticketNumberLabel.style.position = "absolute";
    ticketNumberLabel.style.top = "5px";
    ticketNumberLabel.style.right = "10px";
    ticketNumberLabel.style.fontSize = "12px";
    ticketNumberLabel.style.fontWeight = "bold";
    ticketNumberLabel.innerText = `#${ticketNumber}`;
    ticketContainer.appendChild(ticketNumberLabel);
}

// Генерация числа с анимацией
async function generateNumber() {
    if (generatedNumbers.length >= 90) {
        alert("Все числа сгенерированы!");
        clearInterval(intervalId);
        return;
    }

    let randomAnimationInterval;
    let number;

    // Анимация чисел
    randomAnimationInterval = setInterval(() => {
        const random = Math.floor(Math.random() * 90) + 1;
        animatedNumber.innerText = random;
    }, 50); // Быстрая смена чисел

    await new Promise(resolve => setTimeout(resolve, animationDuration)); // Ждём завершения анимации (1 секунда)

    clearInterval(randomAnimationInterval);

    // Выбор финального числа
    do {
        number = Math.floor(Math.random() * 90) + 1;
    } while (generatedNumbers.includes(number));

    generatedNumbers.push(number);
    animatedNumber.innerText = number;

    // Обновление таблицы и билета
    markNumber(number);

    await new Promise(resolve => setTimeout(resolve, delayAfterNumber)); // Задержка перед следующим числом
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
    createNumberGrid();
    animatedNumber.innerText = "-";
    intervalId = setInterval(generateNumber, generationInterval + animationDuration + delayAfterNumber);
});
