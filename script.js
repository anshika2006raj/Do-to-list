const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const prioritySelect = document.getElementById("priority");


const totalEl = document.getElementById("total");
const doneEl = document.getElementById("done");
const pendingEl = document.getElementById("pending");

const dueDateInput = document.getElementById("dueDate");

const themeToggle = document.getElementById("themeToggle");


// Load tasks when page opens
window.onload = function () {
    loadTasks();
    updateCounter();
    checkExpiredTasks();
};


// Add task
addBtn.addEventListener("click", function () {
    if (taskInput.value.trim() === "") {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");
    let taskText = document.createElement("span");
taskText.textContent = taskInput.value;

let dueText = document.createElement("small");
dueText.textContent = dueDateInput.value
    ? " ⏰ " + new Date(dueDateInput.value).toLocaleString()
    : "";

    // li.textContent = taskInput.value;

    // priority
    li.classList.add(prioritySelect.value);

    if (dueDateInput.value) {
    li.setAttribute("data-due", dueDateInput.value);
}


    // Done button
    let doneBtn = document.createElement("button");
    doneBtn.textContent = "✔";
    doneBtn.classList.add("done-btn");

    doneBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        li.classList.toggle("completed");
        saveTasks();
        updateCounter();
    });

    // Delete button
    let delBtn = document.createElement("button");
    delBtn.textContent = "❌";

    delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        li.remove();
        saveTasks();
        updateCounter();
    });

    li.appendChild(taskText);
li.appendChild(dueText);
li.appendChild(doneBtn);
li.appendChild(delBtn);

    taskList.appendChild(li);

    taskInput.value = "";
    dueDateInput.value = "";
    prioritySelect.value = "low";
    saveTasks();
    updateCounter();
    checkExpiredTasks();
});


// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

// Load tasks from localStorage
function loadTasks() {
    taskList.innerHTML = localStorage.getItem("tasks") || "";
}


function updateCounter() {
    let totalTasks = taskList.children.length;
    let completedTasks = taskList.querySelectorAll(".completed").length;
    let pendingTasks = totalTasks - completedTasks;

    totalEl.textContent = "Total: " + totalTasks;
    doneEl.textContent = "Done: " + completedTasks;
    pendingEl.textContent = "Left: " + pendingTasks;
}

function checkExpiredTasks() {
    let now = new Date();

    document.querySelectorAll("#taskList li").forEach(li => {
        let due = li.getAttribute("data-due");

        if (due && !li.classList.contains("completed")) {
            if (new Date(due) < now) {
                li.classList.add("expired");
            } else {
                li.classList.remove("expired");
            }
        }
    });
}



function loadTheme() {
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️ Light Mode";
    }
}

loadTheme();

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    // save theme
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});
