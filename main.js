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
const changeButton = document.getElementById('change');
const deleteButton = document.getElementById('delete');

// Элементы создаются как отдельные блоки в конце <body>
// (за карточкой Task-1), а не внутри самой карточки.
createButton.addEventListener('click', () => {
    const newElement = document.createElement('div');

    newElement.className = 'new-div';
    newElement.textContent = 'Я новый элемент';

    document.body.appendChild(newElement);
});

changeButton.addEventListener('click', () => {
    const allCreated = document.querySelectorAll('.new-div');
    const lastElement = allCreated[allCreated.length - 1];

    if (lastElement) {
        lastElement.textContent = 'Привет, Камилла';
    }
});

deleteButton.addEventListener('click', () => {
    const allCreated = document.querySelectorAll('.new-div');
    const lastElement = allCreated[allCreated.length - 1];

    if (lastElement) {
        lastElement.remove();
    }
});



const task1Card = document.getElementById('task1-card');

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