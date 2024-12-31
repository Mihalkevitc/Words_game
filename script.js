const syllables = [
    ["ча", "шка"],
    ["ра", "ма"],
    ["жа", "ба"],
    ["жу", "ра", "вль"],
    ["за", "мок"],
    ["со", "ба", "ка"],
    ["ко", "шка"],
    ["жи", "раф"],
    ["мо", "ло", "ко"],
    ["мо", "ло", "ток"],
    ["ро", "за"],
    ["де", "ре", "во"],
    ["пи", "ро", "ги"],
    ["че", "ло", "век"],
    ["иг", "ру", "шка"]
];

// Переменные логики игры
let currentWord = [];
let slotsFilled = [];

// Переменные статистики
let correctAnswers = 0;
let incorrectAnswers = 0;


// Перетасовка слогов слова
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


function startGame() {
    resultElement = document.getElementById("result");
    resultElement.textContent = ""; // Очищает элемент с id="result" (Убираем результат прошлой игры)
    resultElement.classList.remove("show"); // Убираем все анимации и стили
    const slotsContainer = document.getElementById("slots"); // Слоты, в которые перетаскиваем
    const syllablesContainer = document.getElementById("syllables"); // Слоги, которые перетаскиваем

    // Очищаются оба контейнера, чтобы перед новым запуском игры удалить все элементы добавленные ранее
    slotsContainer.innerHTML = "";
    syllablesContainer.innerHTML = "";

    // Из массива syllables выбирается случайный элемент (слово - набор слогов)
    // Для этого генерируется случайное число от 0 до длины массива syllables с помощью Math.random() (-> от 0 до 1 не включ). 
    // Метод Math.floor() округляет это число вниз (4.7 = 4) до ближайшего целого
    const selectedSyllables = syllables[Math.floor(Math.random() * syllables.length)];

    // Перемешиваем слоги
    shuffleArray(selectedSyllables);

    // Массив slotsFilled, который отслеживает, были ли уже заполнены все слоты в игре. 
    // Изначально все элементы массива имеют значение false, что означает, что слоты пустые.
    slotsFilled = Array(selectedSyllables.length).fill(false);

    // Для каждого слога из массива selectedSyllables создается новый контейнер (слот) на странице
    selectedSyllables.forEach((syllable, index) => {
        const slot = document.createElement("div");
        slot.classList.add("slot", "empty");
        slot.setAttribute("data-slot", index); // Информация о номере слота
        slot.setAttribute("ondrop", "drop(event)"); // обработчик drop(event) будет выполнен, когда элемент окажется в этом слоте
        slot.setAttribute("ondragover", "allowDrop(event)"); // Элемент - цель для перетаскиваемых объектов. allowDrop(event) - предотвращение стандартного поведения браузера
        // <div class="slot empty" data-slot="0" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        slotsContainer.appendChild(slot);
    });

    selectedSyllables.forEach((syllable, index) => {
        const syllableDiv = document.createElement("div");
        syllableDiv.classList.add("syllable");
        syllableDiv.textContent = syllable; // Добавляется текстовое содержимое
        syllableDiv.setAttribute("draggable", "true"); // Для браузера: данный элемент можно перетаскивать
        syllableDiv.setAttribute("id", `syllable-${index}`); // Индексируем элементы в id
        syllableDiv.addEventListener("dragstart", drag); // Добавление обработчика события для начала перетаскивания
        // <div class="syllable" id="syllable-0" draggable="true"></div>
        syllablesContainer.appendChild(syllableDiv);
    });

    currentWord = []; // Массив currentWord, который отслеживает текущее слово, которое собирается игроком
}

function updateStats() {
    document.getElementById("gamesPlayed").textContent = correctAnswers + incorrectAnswers;
    document.getElementById("correctAnswers").textContent = correctAnswers;
    document.getElementById("incorrectAnswers").textContent = incorrectAnswers;
}

function allowDrop(event) {
    event.preventDefault(); // Предотвращааем стандартное поведение браузера
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // Передаём id перетаскиваемого элемента
}

function drop(event) {
    event.preventDefault(); // Предотвращааем стандартное поведение браузера
    const data = event.dataTransfer.getData("text"); // Получаем id перетаскиваемого элемента (слога)
    const draggedElement = document.getElementById(data);  // ПОлучаем слог
    const slot = event.target; // Элемент, на который был сброшен перетаскиваемый объект

    const slotIndex = slot.getAttribute("data-slot"); // Получение индекса текущего слота из атрибута конкретного слота
    if (slotsFilled[slotIndex] === false) { // ЕСли слот не занят
        slot.textContent = draggedElement.textContent; // В текст слота помещается текст перетаскиваемого элемента
        slot.classList.remove("empty"); // Убирается класс empty у слота (тепрь слот занят)
        slotsFilled[slotIndex] = true; // Слот заянят
        currentWord[slotIndex] = draggedElement.textContent; // В массиве currentWord обновляется соответствующая ячейка, куда был помещен слог
    }

    checkAnswer(); // Проверяем ответ пользователя
}

// Проверяем, является ли слово правильным
function isWord(word) {
    const validWords = ["чашка", "рама", "жаба", "журавль", "замок", "собака", "кошка", "жираф", "молоко", "молоток", "роза", "дерево", "пироги", "человек", "игрушка"];
    return validWords.includes(word);
}

function checkAnswer() {
    // Проверяем, составляется ли правильное слово
    if (slotsFilled.every(filled => filled)) { // Every() вернет true, если все элементы массива slotsFilled равны true, что означает, что все слоты заполнены.
        const word = currentWord.join('');
        const resultElement = document.getElementById("result");

        if (isWord(word)) {
            correctAnswers++;
            resultElement.textContent = `🥳 Поздравляю! Ты составил слово \n${word.toUpperCase()}! 🏆`;
            resultElement.style.color = "#4caf50"; // зеленый цвет для победы
            resultElement.classList.add("show"); // Добавляем анимацию 
        } else {
            incorrectAnswers++;
            resultElement.textContent = "😣 Не получилось... Но ты сможешь! Попробуй ещё раз! Вперёд! 🚀";
            resultElement.style.color = "#f44336"; // красный цвет для ошибки
            resultElement.classList.add("show"); // Добавляем анимацию
        }
        updateStats();
    }

}

// Инициализация игры
startGame();


// Получаем элементы для логики работы кнопки перезагрузки
const reloadBtn = document.getElementById('reloadBtn');
const confirmationModal = document.getElementById('confirmationModal');
const confirmReload = document.getElementById('confirmReload');
const cancelReload = document.getElementById('cancelReload');

// Переменная для отслеживания, был ли таймер остановлен из-за модального окна
let timerIsClosedByModalWind = false;

// Открытие модального окна при нажатии на кнопку перезагрузки
reloadBtn.addEventListener('click', function () {
    confirmationModal.style.display = 'flex';

    // При открытии модального окна останавливаем таймер, если он работает
    if (isTimerRunning) {
        clearInterval(timer); // Останавливаем таймер
        document.getElementById('timerButton').innerText = 'Запустить';
        isTimerRunning = false; // Сбрасываем состояние
        timerIsClosedByModalWind = true; // Отмечаем, что таймер был остановлен из-за модального окна
    }
});

// Закрытие модального окна и перезагрузка страницы при подтверждении
confirmReload.addEventListener('click', function () {
    location.reload();
});

// Закрытие модального окна без перезагрузки
cancelReload.addEventListener('click', function () {
    confirmationModal.style.display = 'none';

    // Если таймер не был остановлен, останавливаем его (для избежания ошибок работы логики таймера)
    if (isTimerRunning) {
        clearInterval(timer);
        document.getElementById('timerButton').innerText = 'Запустить';
        isTimerRunning = false; // Сбрасываем состояние
    }

    // Если таймер был остановлен из-за модального окна и текущее время не '00:00', запускаем таймер снова
    if (timerIsClosedByModalWind && document.getElementById('timer').innerText !== '00:00') {
        timer = setInterval(updateTime, 1000); // Запускаем таймер (вызывается каждые 1000 мс)
        document.getElementById('timerButton').innerText = 'Остановить';
        timerIsClosedByModalWind = false; // Сбрасываем состояние
        isTimerRunning = true; // Обновляем состояние
    }
});


// Конпка бургер-меню
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
}

// Закрытие меню при клике за пределами
document.addEventListener('click', function (event) {
    const menu = document.getElementById('menu');
    const burgerBtn = document.querySelector('.burger-btn');

    // Проверка, был ли клик за пределами меню и кнопки
    if (!menu.contains(event.target) && !burgerBtn.contains(event.target)) {
        menu.classList.remove('open');
    }
});


// Переменные таймера
let timer; // Идентификатор таймера
let isTimerRunning = false; // Булева переменная, которая отслеживает, запущен ли таймер
// Переменные для хранения секунд и минут таймера
let seconds = 0;
let minutes = 0;

// Функция, которая переключает состояние таймера
function toggleTimer() {
    if (isTimerRunning) {
        clearInterval(timer); // Останавливаем таймер
        document.getElementById('timerButton').innerText = 'Запустить';
    } else {
        timer = setInterval(updateTime, 1000); // Запускаем таймер (вызывается каждые 1000 мс)
        document.getElementById('timerButton').innerText = 'Остановить';
    }
    isTimerRunning = !isTimerRunning;
}

function updateTime() {
    seconds++; // Увеличиваем секунды на 1
    if (seconds === 60) { // Если секунд 60, сбрасываем их на 0 и увеличиваем минуты
        seconds = 0;
        minutes++;
    }

    document.getElementById('timer').innerText = formatTime(minutes, seconds); // Обновляем отображение времени
}

// функция для форматирования времени в виде строки mm:ss
// Если минуты или секунды меньше 10, перед ними добавляется ноль для корректного отображения (например, 05:09 вместо 5:9)
function formatTime(min, sec) {
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}