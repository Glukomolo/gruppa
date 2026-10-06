
const API = "https://dummyjson.com/todos";

// Список хранится в переменной. Сервер фейковый и ничего не запоминает,
// поэтому после каждого ответа мы сами обновляем этот массив.
let todos = [];

const listEl = document.querySelector("#list");
const statusEl = document.querySelector("#status");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.className = isError ? "error" : "";
}

// ---------- 1. GET: получить список ----------
async function loadTodos() {
  setStatus("Загрузка...");
  try {
    const response = await fetch(API + "?limit=8");
    if (!response.ok) throw new Error("Код ответа " + response.status);
    const data = await response.json();
    todos = data.todos; // сам массив лежит внутри поля todos
    setStatus("");
    render();
  } catch (err) {
    setStatus("Не удалось загрузить: " + err.message, true);
  }
}



// ---------- Отрисовка списка ----------
function render() {
  listEl.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Выполнено");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.textContent = todo.todo;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "Удалить";
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, del);
    listEl.append(li);
  });
  if (todos.length === 0) setStatus("Задач нет. Добавьте первую.");
}

// ---------- Форма ----------
document.querySelector("#add-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#new-todo");
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
});

loadTodos();