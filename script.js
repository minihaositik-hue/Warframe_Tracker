// Точка відліку (Початок 1-го тижня у 2026 році)
const START_DATE = new Date('2026-01-05');

let isNextWeekMode = false;

// ТЕПЕР МИ ЗНАЄМО ТИП КОЖНОЇ ЗБРОЇ:
// type: 'primary' (основна), 'secondary' (допоміжна), 'melee' (холодна)
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

    // Отримуємо посилання на ТРИ різні списки
    const listPrimary = document.getElementById('list-primary');
    const listSecondary = document.getElementById('list-secondary');
    const listMelee = document.getElementById('list-melee');

    // Очищаємо всі списки
    listPrimary.innerHTML = '';
    listSecondary.innerHTML = '';
    listMelee.innerHTML = '';

    const weapons = ROTATIONS[rotationIndex];
    
    // Проходимось по зброї і розкидаємо по категоріях
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

        // ГОЛОВНА МАГІЯ: Дивимось на тип і кладемо в потрібний список
        if (item.type === 'primary') {
            listPrimary.appendChild(li);
        } else if (item.type === 'secondary') {
            listSecondary.appendChild(li);
        } else if (item.type === 'melee') {
            listMelee.appendChild(li);
        }
    });
}

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