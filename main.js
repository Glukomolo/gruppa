document.addEventListener('DOMContentLoaded', () => {
    // Массив с ID всех радио-кнопок участников (без главной страницы)
    const personTabs = [
        'tab-davlatbek',
        'tab-abylai',
        'tab-kamilla',
        'tab-liana'
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