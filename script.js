let editIndex = -1;

// ADD TASK
function addTask() {
    let text = document.getElementById("taskInput").value;
    let date = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;

    if (!text) return alert("Enter task!");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIndex === -1) {
        tasks.push({ text, date, priority, completed: false });
    } else {
        tasks[editIndex] = { text, date, priority, completed: false };
        editIndex = -1;
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("taskInput").value = "";
    document.getElementById("dueDate").value = "";

    loadTasks();
}

// LOAD TASKS
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    displayTasks(tasks);
}

// DISPLAY TASKS
function displayTasks(tasks) {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        let info = document.createElement("div");

        let text = document.createElement("span");
        text.innerText = task.text;

        if (task.completed) {
            text.classList.add("completed");
            completedCount++;
        }

        text.onclick = () => toggleTask(index);

        info.appendChild(text);

        if (task.date) {
            let due = document.createElement("div");
            due.innerText = "Due: " + task.date;

            let today = new Date().toISOString().split("T")[0];

            if (task.date < today && !task.completed) {
                due.classList.add("overdue");
            }

            info.appendChild(due);
        }

        let p = document.createElement("div");
        p.innerText = "Priority: " + task.priority;
        p.classList.add(task.priority);
        info.appendChild(p);

        let btns = document.createElement("div");

        let del = document.createElement("button");
        del.innerText = "❌";
        del.onclick = () => deleteTask(index);

        let edit = document.createElement("button");
        edit.innerText = "✏️";
        edit.onclick = () => editTask(index);

        btns.appendChild(edit);
        btns.appendChild(del);

        li.appendChild(info);
        li.appendChild(btns);

        list.appendChild(li);
    });

    document.getElementById("taskCount").innerText = tasks.length;

    let percent = (completedCount / tasks.length) * 100 || 0;
    document.getElementById("progressBar").style.width = percent + "%";
}

// TOGGLE
function toggleTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// DELETE
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// EDIT
function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    document.getElementById("taskInput").value = tasks[index].text;
    document.getElementById("dueDate").value = tasks[index].date;
    document.getElementById("priority").value = tasks[index].priority;

    editIndex = index;
}

// FILTER
function filterTasks(type) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (type === "completed") {
        tasks = tasks.filter(t => t.completed);
    } else if (type === "pending") {
        tasks = tasks.filter(t => !t.completed);
    }

    displayTasks(tasks);
}

// SEARCH
function searchTask(query) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let filtered = tasks.filter(t =>
        t.text.toLowerCase().includes(query.toLowerCase())
    );

    displayTasks(filtered);
}

// DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// INIT
window.onload = loadTasks;