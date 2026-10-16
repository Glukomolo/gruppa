document.addEventListener('DOMContentLoaded', () => {
    
    const personTabs = [
        'tab-davlatbek',
        'tab-abylai',
        'tab-kamilla',
        'tab-liana',
        'tab-task-1',
        'tab-task-2',
        'tab-task-3',
        'tab-task-4'
    ];

    
    const prevButtons = document.querySelectorAll('.prev-btn');
    const nextButtons = document.querySelectorAll('.next-btn');

    function switchTab(step) {
        
        const currentChecked = document.querySelector('input[name="tab"]:checked');
        if (!currentChecked) return;

        
        let currentIndex = personTabs.indexOf(currentChecked.id);

        
        if (currentIndex === -1) {
            currentIndex = 0;
        } else {
            
            currentIndex = (currentIndex + step + personTabs.length) % personTabs.length;
        }

        
        const newRadio = document.getElementById(personTabs[currentIndex]);
        if (newRadio) {
            newRadio.checked = true;
        }
    }

   
    prevButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(-1);
        });
    });

    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(1);
        });
    });

    
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


const oldElement = document.querySelector('.old-element');
if (oldElement) {
    oldElement.remove();
}


const clickableParagraph = document.createElement('p');
clickableParagraph.textContent = "Это изменяемый абзац.";
clickableParagraph.style.cursor = 'pointer';
clickableParagraph.style.userSelect = 'none';

let isChanged = false; 

clickableParagraph.addEventListener('click', () => {
    if (!isChanged) {
        
        clickableParagraph.style.color = '#2f5d44';
        clickableParagraph.style.fontSize = '22px';
        clickableParagraph.style.fontWeight = 'bold';
        isChanged = true;
    } else {
        
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
        
        targetElement.classList.toggle('active');

        
        const currentClasses = targetElement.className || 'нет классов';

        
        console.log('Текущие классы элемента:', currentClasses);

        
        classesOutput.textContent = `Текущие классы элемента: ${currentClasses}`;
    });
}

const createtable = document.getElementById('create-table');

createtable.addEventListener('click', () => {
    const output = document.getElementById('sum-color');
    const container = document.getElementById('table-container');
    output.textContent = '';

    container.innerHTML = '';
    



    const heightInput = document.getElementById('height').value;
    const widthInput = document.getElementById('width').value;

    if (heightInput === "" || widthInput === "") {
        alert('Введите значения для высоты и ширины');
        return;
    }

    const height = parseInt(heightInput, 10);
    const width = parseInt(widthInput, 10);


    if(isNaN(height)  ||isNaN(width) ) {
        alert('Введите корректные числа');
        return;
    }

    if (height <= 0 || width <= 0) {
        alert('Введите положительные числа');
        return;
    }

   
     ;
    const table = document.createElement('table');
for (let i = 0; i < height; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < width; j++) {
        const cell = document.createElement('td');

        cell.addEventListener('click', () => {
            cell.classList.toggle("tableColor");
            const output = document.getElementById("sum-color");
            output.textContent ="Закрашено:" + countSumColor()
            
        });
        
       
        row.appendChild(cell);
    }

    table.appendChild(row);
}

container.innerHTML = ''; 
container.appendChild(table);


  
});

const DeleteTable=document.getElementById("delete-table");
DeleteTable.addEventListener('click',()=>{
    const container=document.getElementById("table-container");
    container.innerHTML = ''; 
    const output=document.getElementById("sum-color");
    output.textContent = "";

})


function countSumColor(){
    const SumColor=document.querySelectorAll(
'#table-container td.tableColor')
return SumColor.length

}
// --- Task 4: Переключение темной темы ---
const themeToggle = document.getElementById('theme-toggle');

function applyThemeLabel() {
    if (!themeToggle) return;
    themeToggle.textContent = document.body.classList.contains('dark-theme')
        ? 'Светлая тема'
        : 'Тёмная тема';
}


if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
applyThemeLabel();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem(
            'theme',
            document.body.classList.contains('dark-theme') ? 'dark' : 'light'
        );
        applyThemeLabel();
    });
}
