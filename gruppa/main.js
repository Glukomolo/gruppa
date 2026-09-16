
const people = {
    "home":{
        role:" ",
        bio:"Главная старница нашей команды"
    },
    "Khasanov Davlatbek": {
        role: "Лидер команды",
        bio: "Наш лидер б отвечает за все разроботки и раюоту в команде "
    },
    "Musa Abylai": {
        role: "Главный за Back end",
        bio: "."
    },
    "Zhumabaeva Kamilla": {
        role: "Главная за Front end",
        bio: "."
    },
    "Kanatova Liana": {
        role: "Главная за дизайн",
        bio: "."
    }
};
 

const tabButtons = document.querySelectorAll('.tab-btn');
 

const bioAvatar = document.getElementById('bioAvatar');
const bioName = document.getElementById('bioName');
const bioRole = document.getElementById('bioRole');
const bioText = document.getElementById('bioText');
const homeCard = document.getElementById('homeCard');
function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
 
function showPerson(name) {
    const person = people[name];
    
    if (name === "home") {
        bioAvatar.style.display = "none";
        homeCard.style.display = "inline-block";
    } else {
        bioAvatar.style.display = "flex";
        bioAvatar.textContent = initials(name);
        homeCard.style.display = "none";
    }
    
    bioName.textContent = name === "home" ? "" : name;
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
 

showPerson(tabButtons[0].getAttribute('data-name'));
homeCard.addEventListener('click', () => {
    const targetBtn = [...tabButtons].find(btn => btn.getAttribute('data-name') === "Khasanov Davlatbek");
    showPerson("Khasanov Davlatbek");
    setActiveButton(targetBtn);
});