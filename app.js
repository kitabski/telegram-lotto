// Глобальные переменные
let ticket = []; // Хранит текущий билет
let generatedNumbers = []; // Хранит список сгенерированных чисел
let intervalId = null; // Идентификатор интервала для анимации чисел
const generationInterval = 1000; // Интервал между генерацией чисел (мс)
const animationDuration = 1000; // Длительность анимации чисел (мс)
const delayAfterNumber = 1000; // Задержка после выбора финального числа (мс)

// Элементы DOM
const ticketNumberInput = document.getElementById("ticket-number"); // Поле для ввода номера билета
const loadTicketButton = document.getElementById("load-ticket"); // Кнопка для загрузки билета
const ticketContainer = document.getElementById("ticket"); // Контейнер для отображения билета
const startGameButton = document.getElementById("start-game"); // Кнопка для начала игры
const animatedNumber = document.getElementById("animated-number"); // Отображение текущего выпавшего числа
const numberGrid = document.getElementById("number-grid"); // Сетка чисел от 1 до 90

/**
 * Создает сетку чисел 10x10 (числа от 1 до 90).
 */
function createNumberGrid() {
    numberGrid.innerHTML = ""; // Очищаем старую сетку
    for (let i = 1; i <= 90; i++) {
        const div = document.createElement("div");
        div.className = "cell"; // Стандартный стиль ячейки
        div.innerText = i; // Добавляем число
        div.id = `number-${i}`; // Уникальный идентификатор для каждой ячейки
        numberGrid.appendChild(div); // Добавляем ячейку в сетку
    }
}

/**
 * Загружает билет по номеру из файла tickets.txt.
 * @param {number} ticketNumber - Номер выбранного билета.
 */
async function loadTicket(ticketNumber) {
    try {
        const response = await fetch("tickets.txt"); // Загружаем файл с билетами
        const data = await response.text(); // Преобразуем файл в текст

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

        renderTicket(ticketNumber); // Отображаем билет
        startGameButton.disabled = false; // Активируем кнопку "Старт"
        createNumberGrid(); // Создаем сетку чисел
    } catch (error) {
        alert("Ошибка загрузки билета!"); // Ошибка при загрузке
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
        div.className = "cell"; // Стандартный стиль ячейки
        div.innerText = cell || ""; // Если ячейка пуста, оставляем пустой текст
        ticketContainer.appendChild(div);
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
        alert("Все числа сгенерированы!");
        clearInterval(intervalId);
        intervalId = null; // Сбрасываем интервал
        startGameButton.disabled = false; // Разблокируем кнопку
        return;
    }

    let randomAnimationInterval;

    // Анимация смены чисел
    randomAnimationInterval = setInterval(() => {
        const random = Math.floor(Math.random() * 90) + 1; // Случайное число от 1 до 90
        animatedNumber.innerText = random; // Показываем число
    }, 50); // Быстрая смена чисел

    await new Promise(resolve => setTimeout(resolve, animationDuration)); // Ждем 1 секунду

    clearInterval(randomAnimationInterval); // Останавливаем анимацию

    // Выбираем финальное число, которого еще не было
    let number;
    do {
        number = Math.floor(Math.random() * 90) + 1;
    } while (generatedNumbers.includes(number));

    generatedNumbers.push(number); // Добавляем число в список сгенерированных
    animatedNumber.innerText = number; // Отображаем финальное число

    markNumber(number); // Помечаем число на билете и в сетке

    await new Promise(resolve => setTimeout(resolve, delayAfterNumber)); // Ждем перед следующим числом
}

/**
 * Помечает совпавшие числа на билете и в сетке.
 * @param {number} number - Число, которое нужно отметить.
 */
function markNumber(number) {
    const cells = document.querySelectorAll(".ticket .cell");
    ticket.flat().forEach((cell, index) => {
        if (cell === number) {
            cells[index].classList.add("marked"); // Помечаем совпавшее число на билете
        }
    });

    // Помечаем число в сетке
    const gridCell = document.getElementById(`number-${number}`);
    if (gridCell) {
        gridCell.classList.add("red");
    }

    // Проверяем, все ли числа на билете совпали
    if (ticket.flat().filter(n => n !== null).every(n => generatedNumbers.includes(n))) {
        alert("🏆 Вы выиграли!");
        clearInterval(intervalId);
        intervalId = null; // Сбрасываем интервал
        startGameButton.disabled = false; // Разблокируем кнопку
    }
}

// События
loadTicketButton.addEventListener("click", () => {
    const ticketNumber = parseInt(ticketNumberInput.value);
    loadTicket(ticketNumber); // Загружаем билет по введенному номеру
});

startGameButton.addEventListener("click", () => {
    if (generatedNumbers.length === 0) {
        createNumberGrid(); // Очищаем сетку чисел
        animatedNumber.innerText = "-"; // Сбрасываем анимацию
        generatedNumbers = []; // Очищаем список сгенерированных чисел
    }

    if (!intervalId) {
        intervalId = setInterval(generateNumber, generationInterval + animationDuration + delayAfterNumber); // Запускаем игру
        startGameButton.disabled = true; // Блокируем кнопку, чтобы предотвратить повторное нажатие
    }
});
