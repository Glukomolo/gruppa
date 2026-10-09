
const API = "https://dummyjson.com/todos";

const todoList = document.getElementById("list");
const todoForm = document.getElementById("add-form");
const todoInput = document.getElementById("new-todo");
const statusDiv = document.getElementById("status");



function showStatus(text, isError = false) {
    statusDiv.textContent = text;
    statusDiv.className = isError ? "error" : "";
}

async function apiRequest(item, method, body) {
    if (item.local) return item; 

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


async function loadTodos() {
    statusDiv.textContent = "Загрузка задач...";
    statusDiv.className = "";

    try {
        const response = await fetch(API);
        const data = await response.json();

        todoList.innerHTML = ""; // 
        statusDiv.textContent = "";

        
        data.todos.slice(0, 10).forEach(item => {
            renderTodoItem(item);
        });

    } catch (error) {
        console.error("Ошибка:", error);
        statusDiv.textContent = "Не удалось загрузить задачи";
        statusDiv.className = "error";
    }
}




async function toggleTodo(item, li, checkbox) {
    const newValue = checkbox.checked;
    try {
        await apiRequest(item, "PUT", { completed: newValue });
        item.completed = newValue;
        li.classList.toggle("done", newValue);
    } catch (error) {
        console.error(error);
        checkbox.checked = !newValue; 
        showStatus("Не удалось обновить задачу", true);
    }
}

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

function renderTodoItem(item, toTop = false) {
    const li = document.createElement("li");
    if (item.completed) li.classList.add("done");

    
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

todoForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const taskText = todoInput.value.trim();
    if (!taskText) return;

    statusDiv.textContent = "Добавление...";
    statusDiv.className = "";

    function getRandomUserId() {
    return Math.floor(Math.random() * 208) + 1; // в dummyjson пользователи 1–208
}

    try {
        const response = await fetch("https://dummyjson.com/todos/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                todo: taskText,
                completed: false,
                userId: getRandomUserId()
            })
        });

   

const newTodo = await response.json();
newTodo.local = true;          // сервер её не сохранил, PUT/DELETE пропускаем
renderTodoItem(newTodo, true); // true: добавить в начало списка


        todoInput.value = "";
        statusDiv.textContent = "Задача успешно добавлена!";
        
        setTimeout(() => { statusDiv.textContent = ""; }, 2000);

    } catch (error) {
        console.error("Ошибка при добавлении:", error);
        statusDiv.textContent = "Ошибка при создании задачи";
        statusDiv.className = "error";
    }
});


loadTodos();