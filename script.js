// Точка відліку (Початок 1-го тижня у 2026 році)
const START_DATE = new Date('2026-01-05');

// Змінна-перемикач: false = поточний тиждень, true = наступний
let isNextWeekMode = false;

const ROTATIONS = {
    1: [
        { name: "Братон", file: "braton" }, { name: "Лато", file: "lato" },
        { name: "Скана", file: "skana" }, { name: "Паріс", file: "paris" },
        { name: "Кунаї", file: "kunai" }
    ],
    2: [
        { name: "Вепр", file: "boar" }, { name: "Гаммакор", file: "gammacor" },
        { name: "Ангструм", file: "angstrum" }, { name: "Горгона", file: "gorgon" },
        { name: "Анку", file: "anku" }
    ],
    3: [
        { name: "Бо", file: "bo" }, { name: "Латрон", file: "latron" },
        { name: "Фуріс", file: "furis" }, { name: "Фуракс", file: "furax" },
        { name: "Стран", file: "strun" }
    ],
    4: [
        { name: "Лекс", file: "lex" }, { name: "Маґістар", file: "magistar" },
        { name: "Болтор", file: "boltor" }, { name: "Бронко", file: "bronco" },
        { name: "Керамічний Кинджал", file: "ceramicdagger" }
    ],
    5: [
        { name: "Торид", file: "torid" }, { name: "Парні Токсоцисти", file: "dualtoxocyst" },
        { name: "Парні Іхори", file: "dualichor" }, { name: "Мітра", file: "miter" },
        { name: "Атомос", file: "atomos" }
    ],
    6: [
        { name: "Ак і Брант", file: "ackbrunt" }, { name: "Сома", file: "soma" },
        { name: "Васто", file: "vasto" }, { name: "Намі Соло", file: "namisolo" },
        { name: "Берстон", file: "burston" }
    ],
    7: [
        { name: "Зайлок", file: "zylok" }, { name: "Сибір", file: "sibear" },
        { name: "Страх", file: "dread" }, { name: "Розпач", file: "despair" },
        { name: "Ненависть", file: "hate" }
    ]
};

// --- ФУНКЦІЯ ПЕРЕМИКАННЯ РЕЖИМУ ---
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

// --- ОСНОВНА ФУНКЦІЯ ---
function updateTracker() {
    const today = new Date();
    const timeDiff = today - START_DATE;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysPassed / 7);
    
    // Розрахунок поточного тижня
    let rotationIndex = (weeksPassed % 7) + 1;

    const weekLabel = document.getElementById('current-week');
    const weaponsList = document.getElementById('weapons-list');

    // Логіка для "Наступного тижня"
    if (isNextWeekMode) {
        rotationIndex = rotationIndex + 1;
        if (rotationIndex > 7) rotationIndex = 1;
        
        weekLabel.textContent = `Наступна ротація: Тиждень ${rotationIndex}`;
        weekLabel.style.color = "#ffffff"; 
    } else {
        weekLabel.textContent = `Поточна ротація: Тиждень ${rotationIndex}`;
        weekLabel.style.color = "#c5a966"; 
    }

    weaponsList.innerHTML = ''; 

    const weapons = ROTATIONS[rotationIndex];
    
    weapons.forEach(item => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = `images/${item.file}.png`; 
        img.alt = item.name;
        img.style.width = '50px';
        img.style.marginRight = '15px';
        img.style.verticalAlign = 'middle';
        img.onerror = function() { this.style.display = 'none'; };

        const span = document.createElement('span');
        span.textContent = item.name;

        li.appendChild(img);
        li.appendChild(span);
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'center';

        weaponsList.appendChild(li);
    });
}

// --- ТАЙМЕР ---
function startCountdown() {
    function update() {
        const now = new Date();
        const nextReset = new Date(now);
        
        let daysUntilMonday = (1 + 7 - now.getUTCDay()) % 7;
        
        if (daysUntilMonday === 0 && 
           (now.getUTCHours() > 0 || now.getUTCMinutes() > 0)) {
            daysUntilMonday = 7;
        }

        nextReset.setUTCDate(now.getUTCDate() + daysUntilMonday);
        nextReset.setUTCHours(0, 0, 0, 0);

        const diff = nextReset - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer').textContent = 
            `${days}д ${hours}г ${minutes}хв ${seconds}с`;
    }

    setInterval(update, 1000);
    update();
}

updateTracker();
startCountdown();