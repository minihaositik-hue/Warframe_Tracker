// Точка відліку (Початок 1-го тижня у 2026 році)
const START_DATE = new Date('2026-01-05');

// Змінні стану
let isNextWeekMode = false;
let isLibraryMode = false;

// БАЗА ДАНИХ ЗБРОЇ
const ROTATIONS = {
    1: [
        { name: "Братон", file: "braton", type: "primary" },
        { name: "Лато", file: "lato", type: "secondary" },
        { name: "Скана", file: "skana", type: "melee" },
        { name: "Паріс", file: "paris", type: "primary" },
        { name: "Кунаї", file: "kunai", type: "secondary" }
    ],
    2: [
        { name: "Вепр", file: "boar", type: "primary" },
        { name: "Гаммакор", file: "gammacor", type: "secondary" },
        { name: "Ангструм", file: "angstrum", type: "secondary" },
        { name: "Горгона", file: "gorgon", type: "primary" },
        { name: "Анку", file: "anku", type: "melee" }
    ],
    3: [
        { name: "Бо", file: "bo", type: "melee" },
        { name: "Латрон", file: "latron", type: "primary" },
        { name: "Фуріс", file: "furis", type: "secondary" },
        { name: "Фуракс", file: "furax", type: "melee" },
        { name: "Стран", file: "strun", type: "primary" }
    ],
    4: [
        { name: "Лекс", file: "lex", type: "secondary" },
        { name: "Маґістар", file: "magistar", type: "melee" },
        { name: "Болтор", file: "boltor", type: "primary" },
        { name: "Бронко", file: "bronco", type: "secondary" },
        { name: "Керамічний Кинджал", file: "ceramicdagger", type: "melee" }
    ],
    5: [
        { name: "Торид", file: "torid", type: "primary" },
        { name: "Парні Токсоцисти", file: "dualtoxocyst", type: "secondary" },
        { name: "Парні Іхори", file: "dualichor", type: "melee" },
        { name: "Мітра", file: "miter", type: "primary" },
        { name: "Атомос", file: "atomos", type: "secondary" }
    ],
    6: [
        { name: "Ак і Брант", file: "ackbrunt", type: "melee" },
        { name: "Сома", file: "soma", type: "primary" },
        { name: "Васто", file: "vasto", type: "secondary" },
        { name: "Намі Соло", file: "namisolo", type: "melee" },
        { name: "Берстон", file: "burston", type: "primary" }
    ],
    7: [
        { name: "Зайлок", file: "zylok", type: "secondary" },
        { name: "Сибір", file: "sibear", type: "melee" },
        { name: "Страх", file: "dread", type: "primary" },
        { name: "Розпач", file: "despair", type: "secondary" },
        { name: "Ненависть", file: "hate", type: "melee" }
    ]
};

// --- ОСНОВНА ЛОГІКА ТРЕКЕРА ---
function updateTracker() {
    const today = new Date();
    const timeDiff = today - START_DATE;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysPassed / 7);
    let rotationIndex = (weeksPassed % 7) + 1;

    const weekLabel = document.getElementById('current-week');

    if (isNextWeekMode) {
        rotationIndex = rotationIndex + 1;
        if (rotationIndex > 7) rotationIndex = 1;
        weekLabel.textContent = `Наступна ротація: Тиждень ${rotationIndex}`;
        weekLabel.style.color = "#ffffff"; 
    } else {
        weekLabel.textContent = `Поточна ротація: Тиждень ${rotationIndex}`;
        weekLabel.style.color = "#c5a966"; 
    }

    // Очищаємо списки
    document.getElementById('list-primary').innerHTML = '';
    document.getElementById('list-secondary').innerHTML = '';
    document.getElementById('list-melee').innerHTML = '';

    const weapons = ROTATIONS[rotationIndex];
    
    weapons.forEach(item => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = `images/${item.file}.png`; 
        img.alt = item.name;
        img.onerror = function() { this.style.display = 'none'; };

        const span = document.createElement('span');
        span.textContent = item.name;

        li.appendChild(img);
        li.appendChild(span);

        // Додаємо в потрібну колонку
        if (item.type === 'primary') document.getElementById('list-primary').appendChild(li);
        else if (item.type === 'secondary') document.getElementById('list-secondary').appendChild(li);
        else if (item.type === 'melee') document.getElementById('list-melee').appendChild(li);
    });
}

function toggleWeek() {
    isNextWeekMode = !isNextWeekMode;
    const btn = document.getElementById('week-toggle');
    
    if (isNextWeekMode) {
        btn.textContent = "⬅ Повернутись до сьогодні";
        btn.style.borderColor = "#ffffff"; 
    } else {
        btn.textContent = "Показати наступний тиждень ➔";
        btn.style.borderColor = "#c5a966"; 
    }
    updateTracker();
}

// --- НОВА ФУНКЦІОНАЛЬНІСТЬ: БІБЛІОТЕКА ---

// 1. Перемикання між Трекером і Арсеналом
function toggleLibrary() {
    isLibraryMode = !isLibraryMode;
    const trackerDiv = document.getElementById('tracker-view');
    const libraryDiv = document.getElementById('library-view');
    const menuBtn = document.getElementById('menu-btn');

    if (isLibraryMode) {
        trackerDiv.style.display = 'none';
        libraryDiv.style.display = 'block';
        menuBtn.innerHTML = '<span class="material-symbols-outlined">arrow_back</span> ТРЕКЕР';
        // Завантажуємо список тільки якщо він порожній
        if (document.getElementById('library-grid').innerHTML === '') {
            loadLibrary();
        }
    } else {
        trackerDiv.style.display = 'block'; // Повертаємо display:block для контейнера
        libraryDiv.style.display = 'none';
        menuBtn.innerHTML = '<span class="material-symbols-outlined">grid_view</span> АРСЕНАЛ';
    }
}

// 2. Завантаження всієї зброї в сітку (СОРТУВАННЯ ПО АЛФАВІТУ)
function loadLibrary() {
    const grid = document.getElementById('library-grid');
    grid.innerHTML = '';
    
    // 1. Створюємо один великий список всієї зброї
    let allWeapons = [];

    // Проходимо по всіх ротаціях і збираємо зброю в масив
    // Важливо: ми додаємо параметр 'rotation' прямо в об'єкт зброї, 
    // щоб потім знати, з якого вона тижня
    for (let rot = 1; rot <= 7; rot++) {
        ROTATIONS[rot].forEach(item => {
            // Створюємо копію об'єкта зброї і додаємо туди номер ротації
            let weaponWithRot = { ...item, rotation: rot }; 
            allWeapons.push(weaponWithRot);
        });
    }

    // 2. Сортуємо цей список за алфавітом (по полю name)
    allWeapons.sort((a, b) => a.name.localeCompare(b.name));

    // 3. Малюємо вже відсортовану зброю
    allWeapons.forEach(item => {
        const card = document.createElement('div');
        card.className = 'library-item';
        // item.rotation ми взяли з кроку 1
        card.onclick = () => openModal(item, item.rotation); 

        const img = document.createElement('img');
        img.src = `images/${item.file}.png`;
        img.onerror = function() { this.src = 'images/favicon.png'; };

        const span = document.createElement('span');
        span.textContent = item.name;

        // (Опціонально) Можна додати маленьку іконку типу зброї, щоб було зрозуміло
        // Але поки залишимо просто картинку і назву
        
        card.appendChild(img);
        card.appendChild(span);
        grid.appendChild(card);
    });
}

// 3. Відкриття Модального вікна з датою
function openModal(item, rotation) {
    const modal = document.getElementById('modal-overlay');
    
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-img').src = `images/${item.file}.png`;
    document.getElementById('modal-rotation').textContent = `Тиждень ${rotation}`;
    
    // ОБЧИСЛЕННЯ ДАТИ
    const dates = calculateNextDate(rotation);
    document.getElementById('modal-date').textContent = dates;

    modal.style.display = 'flex'; // Показуємо вікно
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// 4. Математика дати (Найскладніша частина)
function calculateNextDate(targetRotation) {
    const today = new Date();
    // Скидаємо час сьогоднішнього дня на 00:00, щоб рахувати коректно
    today.setHours(0,0,0,0);

    const timeDiff = today - START_DATE;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysPassed / 7);
    
    const currentRotation = (weeksPassed % 7) + 1;

    // Скільки тижнів чекати?
    let weeksUntil = targetRotation - currentRotation;
    if (weeksUntil < 0) {
        weeksUntil += 7; // Якщо ротація вже пройшла в цьому циклі, чекаємо наступного циклу
    }
    
    // Якщо targetRotation це поточний тиждень, але сьогодні понеділок (день зміни),
    // треба перевірити час, але для простоти показуємо поточний тиждень.
    
    // Знаходимо дату початку наступного понеділка
    // (Але якщо weeksUntil = 0, то це "цей тиждень")
    
    // 1. Початок поточного циклу (минулий понеділок)
    let daysSinceStartOfWeek = (today.getDay() + 6) % 7; // Пн=0, Вт=1...
    
    let nextAppearanceStart = new Date(today);
    // Додаємо дні до наступного потрібного тижня
    // Формула: (Тижнів чекати * 7) - (Днів пройшло з понеділка)
    // АЛЕ! Якщо weeksUntil = 0 (це поточний тиждень), ми маємо показати "Зараз" або дату кінця.
    // Давай простіше: знайдемо найближчий понеділок, коли почнеться ця ротація.
    
    // Якщо weeksUntil = 0, це означає, що ротація ВЖЕ йде.
    // Але якщо ми хочемо "наступну появу", то це через 7 тижнів? 
    // Ні, користувач хоче знати, коли вона доступна.
    
    let daysToAdd = (weeksUntil * 7) - daysSinceStartOfWeek;
    // Якщо це поточний тиждень (daysToAdd <= 0), ми показуємо "ЗАРАЗ!"
    
    if (weeksUntil === 0) {
        return "Вже доступно! (до Нд)";
    }

    nextAppearanceStart.setDate(today.getDate() + daysToAdd);
    
    let nextAppearanceEnd = new Date(nextAppearanceStart);
    nextAppearanceEnd.setDate(nextAppearanceStart.getDate() + 6); // +6 днів (до неділі)

    // Форматуємо дату: "12 лют - 18 лют"
    const options = { day: 'numeric', month: 'short' };
    const startStr = nextAppearanceStart.toLocaleDateString('uk-UA', options);
    const endStr = nextAppearanceEnd.toLocaleDateString('uk-UA', options);

    return `${startStr} — ${endStr}`;
}

// Таймер (без змін)
function startCountdown() {
    function update() {
        const now = new Date();
        const nextReset = new Date(now);
        let daysUntilMonday = (1 + 7 - now.getUTCDay()) % 7;
        if (daysUntilMonday === 0 && (now.getUTCHours() > 0 || now.getUTCMinutes() > 0)) daysUntilMonday = 7;
        nextReset.setUTCDate(now.getUTCDate() + daysUntilMonday);
        nextReset.setUTCHours(0, 0, 0, 0);
        const diff = nextReset - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('timer').textContent = `${days}д ${hours}г ${minutes}хв ${seconds}с`;
    }
    setInterval(update, 1000);
    update();
}
// --- ФУНКЦІЯ ПОШУКУ ---
function filterLibrary() {
    // 1. Отримуємо текст, який ввела користувачка, і робимо його маленькими літерами
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    
    // 2. Беремо всі картки зброї
    const grid = document.getElementById('library-grid');
    const cards = grid.getElementsByClassName('library-item');

    // 3. Проходимось по кожній картці
    for (let i = 0; i < cards.length; i++) {
        const span = cards[i].getElementsByTagName("span")[0];
        const txtValue = span.textContent || span.innerText;

        // Перевіряємо, чи є в назві зброї наш текст
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            cards[i].style.display = ""; // Показуємо
        } else {
            cards[i].style.display = "none"; // Ховаємо
        }
    }
}
updateTracker();
startCountdown();