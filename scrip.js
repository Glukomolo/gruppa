const API = "https://dummyjson.com/todos";

const todoList = document.getElementById("list");
const countEl = document.getElementById("count");
const todoFilter = document.getElementById("todo-filter");
const todoSort = document.getElementById("todo-sort");

const addModal = document.getElementById("add-modal");
const openAddBtn = document.getElementById("open-add");
const todoForm = document.getElementById("add-form");
const todoInput = document.getElementById("new-todo");
const userIdInput = document.getElementById("user-id");
const addCancel = document.getElementById("add-cancel");

const taskInfoText = document.getElementById("task-info-text");
const taskCloseX = document.getElementById("task-close-x");

const deleteModal = document.getElementById("delete-modal");
const deleteText = document.getElementById("delete-text");
const deleteCancel = document.getElementById("delete-cancel");
const deleteConfirm = document.getElementById("delete-confirm");

let editing = null;
let deleting = null;


const itemsById = new Map();
const registry = new Map();
const deletedIds = new Set();
const fetchedUsers = new Set();
let localCounter = 0;

function remember(item) {
    if (!itemsById.has(item.id)) itemsById.set(item.id, item);
    return itemsById.get(item.id);
}


function syncMainItem(item) {
    const ctx = registry.get(item.id);
    if (!ctx) return;
    ctx.span.textContent = item.todo;
    ctx.checkbox.checked = item.completed;
    ctx.li.classList.toggle("done", item.completed);
    ctx.refreshUser();
    updateMainList();
}

function removeFromMain(item) {
    const ctx = registry.get(item.id);
    if (!ctx) return;
    ctx.li.remove();
    registry.delete(item.id);
    updateMainList();
}


function showStatus(text, isError = false) {
    document.querySelectorAll(".status").forEach(el => {
        el.textContent = text;
        el.className = isError ? "status error" : "status";
    });
}

function clearStatusLater() {
    setTimeout(() => showStatus(""), 2000);
}

function updateMainList() {
    const filter = todoFilter.value;
    const sort = todoSort.value;
    let visibleCount = 0;

    const entries = [...registry.values()];

    entries.sort((a, b) => {
        if (sort === "asc") {
            return a.item.todo.localeCompare(b.item.todo);
        } else if (sort === "desc") {
            return b.item.todo.localeCompare(a.item.todo);
        }
        return 0;
    });

    entries.forEach(({ item, li }) => {
        const visible = filter === "all"
            || (filter === "done" && item.completed)
            || (filter === "active" && !item.completed);

        li.hidden = !visible;
        if (visible) {
            visibleCount++;
            todoList.appendChild(li);
        }
    });

    countEl.textContent = visibleCount;
}


todoSort.addEventListener("change", updateMainList);
todoFilter.addEventListener("change", updateMainList);

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
        registry.clear();
        showStatus("");

        data.todos.slice(0, 10).forEach(item => {
            renderTodoItem(remember(item));
        });
        updateMainList();

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
        updateMainList();
    } catch (error) {
        console.error(error);
        checkbox.checked = !newValue;
        showStatus("Не удалось обновить задачу", true);
    }
}

async function deleteTodo(item) {
    try {
        await apiRequest(item, "DELETE");
        deletedIds.add(item.id);
        removeFromMain(item);
        if (userModal.open) renderUserTasks();
        showStatus("Задача удалена");
        clearStatusLater();
    } catch (error) {
        console.error(error);
        showStatus("Не удалось удалить задачу", true);
    }
}

const userCache = new Map();

function loadUser(userId) {
    if (!userCache.has(userId)) {
        const promise = fetch(`https://dummyjson.com/users/${userId}`).then(response => {
            if (!response.ok) {
                throw new Error("Не удалось загрузить пользователя");
            }
            return response.json();
        });
        promise.catch(() => userCache.delete(userId));
        userCache.set(userId, promise);
    }
    return userCache.get(userId);
}


const modal = document.getElementById("task-modal");


async function openTaskModal(ctx) {
    editing = ctx;
    taskInfoText.textContent = ctx.item.todo;

    modal.showModal();

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

if (taskCloseX) {
    taskCloseX.addEventListener("click", () => modal.close());
}

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
    const { item } = deleting;
    deleteModal.close();
    deleteTodo(item);
});

deleteCancel.addEventListener("click", () => deleteModal.close());

deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) deleteModal.close();
});

deleteModal.addEventListener("close", () => { deleting = null; });




const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editText = document.getElementById("edit-text");
const editDone = document.getElementById("edit-done");
const editUserId = document.getElementById("edit-user-id");
const editCancel = document.getElementById("edit-cancel");

function openEditModal(ctx) {
    editing = ctx;
    editText.value = ctx.item.todo;
    editDone.checked = ctx.item.completed;
    editUserId.value = ctx.item.userId;
    showStatus("");
    editModal.showModal();
    editText.focus();
    editText.select();
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editing) return;

    const { item } = editing;
    const text = editText.value.trim();
    if (!text) return;

    const userId = Number(editUserId.value);
    if (!Number.isInteger(userId) || userId < 1) {
        showStatus("Укажите корректный userId", true);
        return;
    }

    showStatus("Сохранение...");
    try {
        await apiRequest(item, "PUT", { todo: text, completed: editDone.checked, userId });
        item.todo = text;
        item.completed = editDone.checked;
        item.userId = userId;
        syncMainItem(item);
        if (userModal.open) renderUserTasks();
        editModal.close();
        showStatus("Задача обновлена");
        clearStatusLater();
    } catch (error) {
        console.error(error);
        showStatus("Не удалось сохранить изменения", true);
    }
});

editCancel.addEventListener("click", () => editModal.close());

editModal.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.close();
});

editModal.addEventListener("close", () => { editing = null; });

function renderTodoItem(item, toTop = false) {
    const li = document.createElement("li");
    if (item.completed) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => toggleTodo(item, li, checkbox));

    // --- блок пользователя (аватар + имя) ---
    const userBtn = document.createElement("button");
    userBtn.type = "button";
    userBtn.className = "todo-user";

    const avatar = document.createElement("img");
    avatar.className = "todo-avatar";
    avatar.alt = "";

    const userNameEl = document.createElement("span");
    userNameEl.className = "todo-username";
    userNameEl.textContent = "Загрузка...";

    userBtn.append(avatar, userNameEl);

    // --- текст задачи ---
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = item.todo;

    const body = document.createElement("div");
    body.className = "todo-body";
    body.append(userBtn, span);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Изменить";
    editBtn.className = "secondary";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";

    const ctx = { item, li, checkbox, span };

    // подгрузка данных пользователя (вызывается и после смены userId)
    ctx.refreshUser = async () => {
        const id = item.userId;
        try {
            const user = await loadUser(id);
            if (item.userId !== id) return; // userId успели поменять
            avatar.src = user.image;
            userNameEl.textContent = user.username ? `@${user.username}` : `${user.firstName} ${user.lastName}`;
            userBtn.onclick = () => openUserModal(user);
        } catch (error) {
            console.error(error);
            userNameEl.textContent = `Пользователь #${id}`;
        }
    };

    registry.set(item.id, ctx);

    editBtn.addEventListener("click", () => openEditModal(ctx, true));
    delBtn.addEventListener("click", () => openDeleteModal({ item, li }));
    span.addEventListener("click", () => openTaskModal(ctx));

    li.append(checkbox, body, editBtn, delBtn);

    if (toTop) {
        todoList.prepend(li);
    } else {
        todoList.appendChild(li);
    }

    ctx.refreshUser();
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
        newTodo.id = `local-${++localCounter}`;
        newTodo.userId = userId;
        renderTodoItem(remember(newTodo), true);
        updateMainList();

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


const utList = document.getElementById("ut-list");
const utForm = document.getElementById("ut-add-form");
const utInput = document.getElementById("ut-new");
const utStatusEl = document.getElementById("ut-status");
const utSubtitle = document.getElementById("ut-subtitle");
const utFilterBtns = document.querySelectorAll(".ut-filter");

let utUserId = null;
let utFilter = "all";
let utStatusTimer = null;

function utSetStatus(text, isError = false, autoClear = false) {
    clearTimeout(utStatusTimer);
    utStatusEl.textContent = text;
    utStatusEl.className = isError ? "ut-status error" : "ut-status";
    if (autoClear) utStatusTimer = setTimeout(() => utSetStatus(""), 2000);
}

function getUserTodos(userId) {
    const all = [...itemsById.values()].filter(
        item => item.userId === userId && !deletedIds.has(item.id)
    );
    const local = all.filter(item => item.local).reverse();
    const server = all.filter(item => !item.local).sort((a, b) => a.id - b.id);
    return [...local, ...server];
}

function renderUserTasks() {
    const all = getUserTodos(utUserId);
    const counts = {
        all: all.length,
        active: all.filter(item => !item.completed).length,
        done: all.filter(item => item.completed).length
    };

    utFilterBtns.forEach(btn => {
        const isActive = btn.dataset.filter === utFilter;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
        btn.querySelector("span").textContent = counts[btn.dataset.filter];
    });

    const shown = all.filter(item =>
        utFilter === "all" ? true :
            utFilter === "done" ? item.completed :
                !item.completed
    );

    utList.innerHTML = "";

    if (!shown.length) {
        const empty = document.createElement("li");
        empty.className = "ut-empty";
        empty.textContent =
            utFilter === "done" ? "Готовых задач пока нет" :
                utFilter === "active" ? "Задач в работе нет" :
                    "У пользователя пока нет задач";
        utList.append(empty);
        return;
    }

    shown.forEach(item => utList.append(buildUserTaskRow(item)));
}

function buildUserTaskRow(item) {
    const li = document.createElement("li");

    li.classList.toggle("done", item.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => toggleUserTask(item, checkbox.checked));

    const span = document.createElement("span");
    span.textContent = item.todo;

    const actions = document.createElement("div");
    actions.className = "ut-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "secondary";
    editBtn.textContent = "Изменить";
    editBtn.addEventListener("click", () => openEditModal({ item }));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Удалить";
    delBtn.addEventListener("click", () => openDeleteModal({ item }));

    actions.append(editBtn, delBtn);
    li.append(checkbox, span, actions);
    return li;
}

async function toggleUserTask(item, checked) {
    try {
        await apiRequest(item, "PUT", { completed: checked });
        item.completed = checked;
        syncMainItem(item);
        utSetStatus("");
    } catch (error) {
        console.error(error);
        utSetStatus("Не удалось обновить задачу", true);
    }
    renderUserTasks();
}

utForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = utInput.value.trim();
    if (!text) return;

    const userId = utUserId;
    utSetStatus("Добавление...");

    try {
        const response = await fetch("https://dummyjson.com/todos/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todo: text, completed: false, userId })
        });
        if (!response.ok) throw new Error("Ошибка сервера: " + response.status);

        const newTodo = await response.json();
        newTodo.local = true;
        newTodo.id = `local-${++localCounter}`;
        newTodo.userId = userId;

        renderTodoItem(remember(newTodo), true);
        updateMainList();

        utInput.value = "";
        if (utFilter === "done") utFilter = "all";
        utSetStatus("Задача добавлена", false, true);
        if (utUserId === userId) renderUserTasks();
    } catch (error) {
        console.error(error);
        utSetStatus("Не удалось добавить задачу", true);
    }
});

utFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        utFilter = btn.dataset.filter;
        renderUserTasks();
    });
});

async function loadUserTasks(userId) {
    if (fetchedUsers.has(userId)) return;

    utSetStatus("Загрузка задач...");
    try {
        const response = await fetch(`${API}/user/${userId}`);
        if (!response.ok) throw new Error("Ошибка сервера: " + response.status);

        const data = await response.json();
        data.todos.forEach(item => remember(item));
        fetchedUsers.add(userId);

        if (utUserId === userId) {
            utSetStatus("");
            renderUserTasks();
        }
    } catch (error) {
        console.error(error);
        if (utUserId === userId) utSetStatus("Не удалось загрузить задачи", true);
    }
}

function openUserModal(user) {
    userName.textContent = `${user.firstName} ${user.lastName}`;
    userEmail.textContent = user.email || "Не указано";
    userAge.textContent = user.age ?? "Не указано";

    document.getElementById("user-photo").src = user.image;
    document.getElementById("user-username").textContent =
        user.username ? `@${user.username}` : "";
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

    utUserId = user.id;
    utFilter = "all";
    utInput.value = "";
    utSetStatus("");
    utSubtitle.textContent = `${user.firstName} ${user.lastName}, ID ${user.id}`;
    renderUserTasks();

    userModal.showModal();
    loadUserTasks(user.id);
}

userClose.addEventListener("click", () => userModal.close());

userModal.addEventListener("click", (e) => {
    if (e.target === userModal || e.target.classList.contains("user-layout")) {
        userModal.close();
    }
});

loadTodos();