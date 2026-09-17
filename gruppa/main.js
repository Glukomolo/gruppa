

const people = {
    "Khasanov Davlatbek": {
        role: "Лидер команды",
        bio: "Отвечает за разработку проекта, координацию работы команды и распределение задач между участниками.",
        photo: "img/davlatbek.jpg"
    },
    "Musa Abylai": {
        role: "Главный за Backend",
        bio: "Отвечает за серверную часть проекта, обработку данных и работу функций сайта.",
        photo: "img/abylai.jpg"
    },
    "Zhumabayeva Kamilla": {
        role: "Главная за Frontend",
        bio: "Отвечает за внешний вид сайта, интерфейс и удобство взаимодействия с пользователем.",
        photo: "img/kamilla.jpg"
    },
    "Kanatova Liana": {
        role: "Главная за дизайн",
        bio: "Отвечает за дизайн проекта, визуальное оформление и создание единого стиля сайта.",
        photo: "img/liana.jpg"
    }
};

const tabButtons = document.querySelectorAll('.tab-btn');

const bioContent = document.getElementById('bioContent');
const bioAvatar = document.getElementById('bioAvatar');
const bioName = document.getElementById('bioName');
const bioRole = document.getElementById('bioRole');
const bioText = document.getElementById('bioText');
const homeGrid = document.getElementById('homeGrid');


function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}


function fillAvatar(avatarEl, name, photo) {
    if (photo) {
        avatarEl.innerHTML = `<img src="${photo}" alt="${name}">`;
    } else {
        avatarEl.innerHTML = initials(name);
    }
}


function buildHomeGrid() {
    homeGrid.innerHTML = '';
    Object.keys(people).forEach(name => {
        const person = people[name];

        const card = document.createElement('div');
        card.className = 'home-card';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        fillAvatar(avatarDiv, name, person.photo);

        const nameP = document.createElement('p');
        nameP.textContent = name;

        card.appendChild(avatarDiv);
        card.appendChild(nameP);

        
        card.addEventListener('click', () => {
            const targetBtn = [...tabButtons].find(btn => btn.getAttribute('data-name') === name);
            showPerson(name);
            setActiveButton(targetBtn);
        });

        homeGrid.appendChild(card);
    });
}

function showPerson(name) {
    if (name === "home") {
        bioContent.style.display = "none";
        homeGrid.style.display = "grid";
        return;
    }

    const person = people[name];

    bioContent.style.display = "block";
    homeGrid.style.display = "none";

    fillAvatar(bioAvatar, name, person.photo);
    bioName.textContent = name;
    bioRole.textContent = person.role;
    bioText.textContent = person.bio;
}

function setActiveButton(clickedBtn) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        showPerson(name);
        setActiveButton(btn);
    });
});


buildHomeGrid();
showPerson('home');