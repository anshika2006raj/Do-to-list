const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const prioritySelect = document.getElementById("priority");


const totalEl = document.getElementById("total");
const doneEl = document.getElementById("done");
const pendingEl = document.getElementById("pending");

const dueDateInput = document.getElementById("dueDate");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchInput");



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
    li.setAttribute("data-due", dueDateInput.value)
    sortTasks();

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
        updateProgress();

        sortTasks();

    });


    // Delete button
    let delBtn = document.createElement("button");
    delBtn.textContent = "❌";

    delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        li.remove();
        saveTasks();
        updateCounter();
        updateProgress();

        showToast("Task added ✅");

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
    updateProgress();

    //checkExpiredTasks();
    showToast("Task deleted ❌");



});

function updateProgress() {
    let total = taskList.children.length;
    let completed = taskList.querySelectorAll(".completed").length;

    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("progress").style.width = percent + "%";
    document.getElementById("progressText").textContent =
        percent + "% tasks completed";
}



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

//const toast = document.getElementById("toast");

function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}

taskInput.addEventListener("keydown", function (e) {

    // Enter → add task
    if (e.key === "Enter") {
        addBtn.click();
    }

    // Esc → clear input
    if (e.key === "Escape") {
        taskInput.value = "";
    }
});

function sortTasks() {
    let tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {

        // completed neeche
        if (a.classList.contains("completed")) return 1;
        if (b.classList.contains("completed")) return -1;

        const priorityOrder = { high: 1, medium: 2, low: 3 };

        return priorityOrder[a.classList[0]] - priorityOrder[b.classList[0]];
    });

    tasks.forEach(task => taskList.appendChild(task));
}

window.onload = function () {
    loadTasks();
    updateCounter();
    checkExpiredTasks();
    sortTasks();
};

//const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    let searchText = searchInput.value.toLowerCase();
    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {
        let text = task.firstChild.textContent.toLowerCase();

        if (text.includes(searchText)) {
            task.style.display = "flex";

            if (searchText !== "") {
                let originalText = task.firstChild.textContent;
                let regex = new RegExp(`(${searchText})`, "gi");
                task.firstChild.innerHTML = originalText.replace(
                    regex,
                    `<span class="highlight">$1</span>`
                );
            }
        } else {
            task.style.display = "none";
        }

        if (searchText === "") {
            task.firstChild.innerHTML = task.firstChild.textContent;
        }
    });
});

window.onload = function () {
    loadTasks();
    updateCounter();
    updateProgress();
    checkExpiredTasks();
    sortTasks();
};
