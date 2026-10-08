
const API = "https://dummyjson.com/todos";
// Находим элементы строго по ID из твоего HTML
const todoList = document.getElementById("list");
const todoForm = document.getElementById("add-form");
const todoInput = document.getElementById("new-todo");
const statusDiv = document.getElementById("status");



function showStatus(text, isError = false) {
    statusDiv.textContent = text;
    statusDiv.className = isError ? "error" : "";
}

async function apiRequest(item, method, body) {
    if (item.local) return item; // созданные через POST на сервере не существуют

    const options = { method };
    if (body) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API}/${item.id}`, options);
    if (!response.ok) {
        throw new Error("Ошибка сервера: " + response.status);
    }
    return response.json();
}

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



// PUT: отметить выполненной / невыполненной
async function toggleTodo(item, li, checkbox) {
    const newValue = checkbox.checked;
    try {
        await apiRequest(item, "PUT", { completed: newValue });
        item.completed = newValue;
        li.classList.toggle("done", newValue);
    } catch (error) {
        console.error(error);
        checkbox.checked = !newValue; // откатываем галочку
        showStatus("Не удалось обновить задачу", true);
    }
}

// DELETE
async function deleteTodo(item, li) {
    try {
        await apiRequest(item, "DELETE");
        li.remove();
        showStatus("Задача удалена");
        setTimeout(() => showStatus(""), 2000);
    } catch (error) {
        console.error(error);
        showStatus("Не удалось удалить задачу", true);
    }
}
// Вспомогательная функция для отрисовки одной задачи (без кнопки удаления)
function renderTodoItem(item, toTop = false) {
    const li = document.createElement("li");
    if (item.completed) li.classList.add("done");

    // чекбокс: отмечен, если задача выполнена
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => toggleTodo(item, li, checkbox));

    const span = document.createElement("span");
    span.textContent = item.todo;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";
    delBtn.addEventListener("click", () => deleteTodo(item, li));

    li.append(checkbox, span, delBtn);

    if (toTop) {
        todoList.prepend(li);
    } else {
        todoList.appendChild(li);
    }
}
// 2. Функция отправки новой задачи через форму (POST)
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const taskText = todoInput.value.trim();
    if (!taskText) return;

    statusDiv.textContent = "Добавление...";
    statusDiv.className = "";

    try {
        const response = await fetch("https://dummyjson.com/todos/add", {
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