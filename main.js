document.addEventListener('DOMContentLoaded', () => {
    // Массив с ID всех радио-кнопок участников (без главной страницы)
    const personTabs = [
        'tab-davlatbek',
        'tab-abylai',
        'tab-kamilla',
        'tab-liana',
        'tab-task-1'
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