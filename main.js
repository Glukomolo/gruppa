document.addEventListener('DOMContentLoaded', () => {
    // Массив с ID всех радио-кнопок участников (без главной страницы)
    const personTabs = [
        'tab-davlatbek',
        'tab-abylai',
        'tab-kamilla',
        'tab-liana',
        'tab-task-1',
        'tab-task-2'
    ];

    // Находим все кнопки со стрелками
    const prevButtons = document.querySelectorAll('.prev-btn');
    const nextButtons = document.querySelectorAll('.next-btn');

    function switchTab(step) {
        // Находим текущую выбранную radio-кнопку
        const currentChecked = document.querySelector('input[name="tab"]:checked');
        if (!currentChecked) return;

        // Находим индекс текущего участника в нашем массиве
        let currentIndex = personTabs.indexOf(currentChecked.id);

        // Если сейчас выбрана «Главная страница» или неизвестная вкладка — открываем первого
        if (currentIndex === -1) {
            currentIndex = 0;
        } else {
            // Вычисляем новый индекс с зацикливанием
            currentIndex = (currentIndex + step + personTabs.length) % personTabs.length;
        }

        // Переключаем radio-кнопку на нового участника
        const newRadio = document.getElementById(personTabs[currentIndex]);
        if (newRadio) {
            newRadio.checked = true;
        }
    }

    // Привязываем обработчики событий для всех кнопок "Назад"
    prevButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(-1);
        });
    });

    // Привязываем обработчики событий для всех кнопок "Вперед"
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(1);
        });
    });

    // Дополнительно: переключение кнопками клавиатуры (влево / вправо)
    document.addEventListener('keydown', (e) => {
        const homeRadio = document.getElementById('tab-home');
        if (homeRadio && !homeRadio.checked) {
            if (e.key === 'ArrowLeft') switchTab(-1);
            if (e.key === 'ArrowRight') switchTab(1);
        }
    });
});

const createButton = document.getElementById('create');
const deleteButton = document.getElementById('delete');
const createdElements = document.getElementById('create-elements');

createButton.addEventListener('click', () => {
    const newElement = document.createElement('p');

    newElement.textContent = 'Новый элемент';

    createdElements.appendChild(newElement);
});

deleteButton.addEventListener('click', () => {
    const lastElement = createdElements.lastElementChild;

    if (lastElement) {
        lastElement.remove();
    }
});

const addBodyButton = document.getElementById('body');
const removeBodyButton = document.getElementById('d-body');

addBodyButton.addEventListener('click', () => {
    const p = document.createElement('p');
    p.textContent = 'Новый текст';
    p.classList.add('body-text');

    document.body.appendChild(p);
});

removeBodyButton.addEventListener('click', () => {
    const all = document.querySelectorAll('.body-text');
    const last = all[all.length - 1];

    if (last) {
        last.remove();
    }
});

// --- Пункт 1: Найдите элемент по ID и измените его текст на "Привет, мир!" ---
const targetTextElement = document.getElementById('target-text');
if (targetTextElement) {
    targetTextElement.textContent = "Привет, мир!";
}


// --- Пункт 2: Создайте новый элемент <div> с классом new-div и текстом "Я новый элемент" ---
const newDiv = document.createElement('div');
newDiv.className = 'new-div';
newDiv.textContent = "Я новый элемент";

const task1Card = document.getElementById('task1-card');
if (task1Card) {
    task1Card.appendChild(newDiv);
}

// --- Пункт 3: Удалите элемент с классом old-element ---
const oldElement = document.querySelector('.old-element');
if (oldElement) {
    oldElement.remove();
}

// --- Пункт 4: Создаем элемент <p> с переключением стилей туда-обратно по клику ---
const clickableParagraph = document.createElement('p');
clickableParagraph.textContent = "Это изменяемый абзац.";
clickableParagraph.style.cursor = 'pointer';
clickableParagraph.style.userSelect = 'none';

let isChanged = false; // Флаг для переключения обратно

clickableParagraph.addEventListener('click', () => {
    if (!isChanged) {
        // Первое состояние (меняем)
        clickableParagraph.style.color = '#2f5d44';
        clickableParagraph.style.fontSize = '22px';
        clickableParagraph.style.fontWeight = 'bold';
        isChanged = true;
    } else {
        // Возвращаем обратно
        clickableParagraph.style.color = '';
        clickableParagraph.style.fontSize = '';
        clickableParagraph.style.fontWeight = '';
        isChanged = false;
    }
});

if (task1Card) {
    task1Card.appendChild(clickableParagraph);
}

// --- Task 2: Управление классами элементов ---
const targetElement = document.getElementById('target-element');
const toggleButton = document.getElementById('toggle-btn');
const classesOutput = document.getElementById('classes-output');

if (toggleButton && targetElement && classesOutput) {
    toggleButton.addEventListener('click', () => {
        // Переключаем класс active (добавляет, если нет, и удаляет, если есть)
        targetElement.classList.toggle('active');

        // Получаем текущие классы элемента в виде строки
        const currentClasses = targetElement.className || 'нет классов';

        // Выводим в консоль
        console.log('Текущие классы элемента:', currentClasses);

        // Выводим в абзац <p> рядом
        classesOutput.textContent = `Текущие классы элемента: ${currentClasses}`;
    });
}