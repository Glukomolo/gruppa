const API = "https://dummyjson.com/todos";

const todoList = document.getElementById("list");
const countEl = document.getElementById("count");

const addModal = document.getElementById("add-modal");
const openAddBtn = document.getElementById("open-add");
const todoForm = document.getElementById("add-form");
const todoInput = document.getElementById("new-todo");
const userIdInput = document.getElementById("user-id");
const addCancel = document.getElementById("add-cancel");

const modal = document.getElementById("task-modal");
const editForm = document.getElementById("edit-form");
const editText = document.getElementById("edit-text");
const editUserId = document.getElementById("edit-user-id");
const editDone = document.getElementById("edit-done");
const editCancel = document.getElementById("edit-cancel");

const deleteModal = document.getElementById("delete-modal");
const deleteText = document.getElementById("delete-text");
const deleteCancel = document.getElementById("delete-cancel");
const deleteConfirm = document.getElementById("delete-confirm");

let editing = null;
let deleting = null;


function showStatus(text, isError = false) {
    document.querySelectorAll(".status").forEach(el => {
        el.textContent = text;
        el.className = isError ? "status error" : "status";
    });
}

function clearStatusLater() {
    setTimeout(() => showStatus(""), 2000);
}

function updateCount() {
    countEl.textContent = todoList.children.length;
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
    showStatus("Загрузка задач...");

    try {
        const response = await fetch(API);
        const data = await response.json();

        todoList.innerHTML = "";
        showStatus("");

        data.todos.slice(0, 10).forEach(item => {
            renderTodoItem(item);
        });
        updateCount();

    } catch (error) {
        console.error("Ошибка:", error);
        showStatus("Не удалось загрузить задачи", true);
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
        updateCount();
        showStatus("Задача удалена");
        clearStatusLater();
    } catch (error) {
        console.error(error);
        showStatus("Не удалось удалить задачу", true);
    }
}

async function loadUser(userId) {
    const response = await fetch(
        `https://dummyjson.com/users/${userId}`
    );

    if (!response.ok) {
        throw new Error("Не удалось загрузить пользователя");
    }

    return response.json();
}

async function openEditModal(ctx, canEdit = false) {
    editing = ctx;
    editText.readOnly = !canEdit;
editUserId.readOnly = !canEdit;
editDone.disabled = !canEdit;
editUserId.closest(".field-row").hidden = !canEdit;
editDone.closest(".done-row").hidden = !canEdit;

editForm.querySelector('button[type="submit"]').hidden = !canEdit;
editForm.querySelector("h2").textContent =
    canEdit ? "Редактирование задачи" : "Просмотр задачи";

editCancel.textContent = canEdit ? "Отмена" : "Закрыть";
    editText.value = ctx.item.todo;
    editUserId.value = ctx.item.userId;
    editDone.checked = ctx.item.completed;
    modal.showModal();
    editText.focus();

    const userButton = document.getElementById("task-user");
    userButton.textContent = "Загрузка...";
    userButton.disabled = true;
    

    try {
        const user = await loadUser(ctx.item.userId);

        userButton.textContent = `${user.firstName} ${user.lastName}`;
        userButton.disabled = false;
        userButton.onclick = () => openUserModal(user);
    } catch (error) {
        userButton.textContent = "Не удалось загрузить пользователя";
        console.error(error);
    }
}


editCancel.addEventListener("click", () => modal.close());

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editing) return;

    const { item, li, checkbox, span } = editing;
    const text = editText.value.trim();
    if (!text) return;

    const body = {
        todo: text,
        completed: editDone.checked,
        userId: Number(editUserId.value) || item.userId
    };

    try {
        await apiRequest(item, "PUT", body);
        Object.assign(item, body);
        span.textContent = item.todo;
        checkbox.checked = item.completed;
        li.classList.toggle("done", item.completed);

        modal.close();
        showStatus("Задача обновлена");
        clearStatusLater();
    } catch (error) {
        console.error(error);
        showStatus("Не удалось сохранить изменения", true);
        modal.close();
    }
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
});

modal.addEventListener("close", () => { editing = null; });


function openDeleteModal(ctx) {
    deleting = ctx;
    deleteText.textContent = ctx.item.todo;
    deleteModal.showModal();
}

deleteConfirm.addEventListener("click", () => {
    if (!deleting) return;
    const { item, li } = deleting;
    deleteModal.close();
    deleteTodo(item, li);
});

deleteCancel.addEventListener("click", () => deleteModal.close());

deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) deleteModal.close();
});

deleteModal.addEventListener("close", () => { deleting = null; });


function renderTodoItem(item, toTop = false) {
    const li = document.createElement("li");
    if (item.completed) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => toggleTodo(item, li, checkbox));

    const span = document.createElement("span");
    span.textContent = item.todo;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Изменить";
    editBtn.className = "secondary";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";

    const ctx = { item, li, checkbox, span };
    span.addEventListener("click", () => openEditModal(ctx, false));
    editBtn.addEventListener("click", () => openEditModal(ctx, true));
    delBtn.addEventListener("click", () => openDeleteModal({ item, li }));

    li.append(checkbox, span, editBtn, delBtn);

    if (toTop) {
        todoList.prepend(li);
    } else {
        todoList.appendChild(li);
    }
}

openAddBtn.addEventListener("click", () => {
    showStatus("");
    addModal.showModal();
    todoInput.focus();
});

addCancel.addEventListener("click", () => addModal.close());

addModal.addEventListener("click", (e) => {
    if (e.target === addModal) addModal.close();
});


todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskText = todoInput.value.trim();
    if (!taskText) return;

    const userId = Number(userIdInput.value) || 1;

    showStatus("Добавление...");

    try {
        const response = await fetch("https://dummyjson.com/todos/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                todo: taskText,
                completed: false,
                userId: userId
            })
        });

        const newTodo = await response.json();
        newTodo.local = true;
        renderTodoItem(newTodo, true);
        updateCount();

        todoInput.value = "";
        addModal.close();
        showStatus("Задача успешно добавлена!");
        clearStatusLater();

    } catch (error) {
        console.error("Ошибка при добавлении:", error);
        showStatus("Ошибка при создании задачи", true);
    }
});

const userModal = document.getElementById("user-modal");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userAge = document.getElementById("user-age");
const userClose = document.getElementById("user-close");

function openUserModal(user) {
    userName.textContent = `${user.firstName} ${user.lastName}`;
    userEmail.textContent = user.email || "Не указано";
    userAge.textContent = user.age ?? "Не указано";

    document.getElementById("user-photo").src = user.image;
    document.getElementById("user-id-label").textContent =
        `ID пользователя: ${user.id}`;
    document.getElementById("user-phone").textContent =
        user.phone || "Не указано";
    document.getElementById("user-city").textContent =
        user.address?.city || "Не указано";
    document.getElementById("user-company").textContent =
        user.company?.name || "Не указано";
    document.getElementById("user-job").textContent =
        user.company?.title || "Не указано";

    userModal.showModal();
}
userClose.addEventListener("click", () => {
    userModal.close();
});
loadTodos();