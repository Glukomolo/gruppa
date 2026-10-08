
const API = "https://dummyjson.com/todos";
// Находим элементы строго по ID из твоего HTML
const todoList = document.getElementById("list");
const todoForm = document.getElementById("add-form");
const todoInput = document.getElementById("new-todo");
const statusDiv = document.getElementById("status");

// 1. Функция получения задач (GET)
async function loadTodos() {
    statusDiv.textContent = "Загрузка задач...";
    statusDiv.className = "";

    try {
        const response = await fetch(API);
        const data = await response.json();

        todoList.innerHTML = ""; // Очищаем список
        statusDiv.textContent = "";

        // Выводим первые 10 задач для примера
        data.todos.slice(0, 10).forEach(item => {
            renderTodoItem(item);
        });

    } catch (error) {
        console.error("Ошибка:", error);
        statusDiv.textContent = "Не удалось загрузить задачи";
        statusDiv.className = "error";
    }
}

// Вспомогательная функция для отрисовки одной задачи (без кнопки удаления)
function renderTodoItem(item) {
    const li = document.createElement("li");
    
    // Если задача выполнена, добавляем класс .done (сработает твой CSS: text-decoration: line-through)
    if (item.completed) {
        li.classList.add("done");
    }

    // Текст задачи
    const span = document.createElement("span");
    span.textContent = item.todo;
    li.appendChild(span);

    // Больше никаких кнопок удаления — это сделает другой член команды

    todoList.appendChild(li);
}

// 2. Функция отправки новой задачи через форму (POST)
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const taskText = todoInput.value.trim();
    if (!taskText) return;

    statusDiv.textContent = "Добавление...";
    statusDiv.className = "";

    try {
        const response =- await fetch("https://dummyjson.com/todos/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                todo: taskText,
                completed: false,
                userId: 5
            })
        });

        const newTodo = await response.json();

        // Добавляем созданную задачу в начало списка
        renderTodoItem(newTodo);

        // Очищаем инпут и выводим статус
        todoInput.value = "";
        statusDiv.textContent = "Задача успешно добавлена!";
        
        setTimeout(() => { statusDiv.textContent = ""; }, 2000);

    } catch (error) {
        console.error("Ошибка при добавлении:", error);
        statusDiv.textContent = "Ошибка при создании задачи";
        statusDiv.className = "error";
    }
});

// Запускаем загрузку при открытии страницы
loadTodos();