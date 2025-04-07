let selectedCategory = "";
let editingTaskId = null; // Track task being edited

// API Base URL
const API_URL = "http://localhost:5000/tasks";

// Select Category (School or Personal)
document.getElementById("schoolBtn").addEventListener("click", function() {
    selectedCategory = "School";
    document.getElementById("schoolBtn").style.opacity = "0.8";
    document.getElementById("personalBtn").style.opacity = "1";
});

document.getElementById("personalBtn").addEventListener("click", function() {
    selectedCategory = "Personal";
    document.getElementById("personalBtn").style.opacity = "0.8";
    document.getElementById("schoolBtn").style.opacity = "1";
});

// Fetch and display tasks from database
async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear list before reloading

    tasks.forEach(task => {
        createTaskElement(task.id, task.category, task.tasks);
    });

    // Reset input field and button after loading tasks
    document.getElementById("taskInput").value = "";
    document.getElementById("addTask").textContent = "ADD TO-DO";
    editingTaskId = null;
}

// Add or Update Task
document.getElementById("addTask").addEventListener("click", async function() {
    let taskText = document.getElementById("taskInput").value.trim();

    if (!taskText || !selectedCategory) {
        alert("Please enter a task and select a category!");
        return;
    }

    if (editingTaskId) {
        // Update existing task
        const response = await fetch(`${API_URL}/${editingTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: selectedCategory, tasks: taskText }),
        });

        if (response.ok) {
            loadTasks(); // Refresh tasks after update
        }
    } else {
        // Add new task
        const newTask = { category: selectedCategory, tasks: taskText };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            loadTasks(); // Refresh tasks after adding
        }
    }
});

// Create Task Element in the DOM
function createTaskElement(id, category, taskText) {
    let taskItem = document.createElement("div");
    taskItem.classList.add("task");

    if (category === "School") {
        taskItem.classList.add("school-task");
    } else if (category === "Personal") {
        taskItem.classList.add("personal-task");
    }

    let taskContent = document.createElement("span");
    taskContent.textContent = taskText;

    let completeButton = document.createElement("button");
    completeButton.textContent = "✔";
    completeButton.classList.add("complete");
    completeButton.addEventListener("click", function() {
        taskItem.classList.toggle("completed");
    });

    let editButton = document.createElement("button");
    editButton.textContent = "✏";
    editButton.classList.add("edit");
    editButton.addEventListener("click", function() {
        // Set task text in input field
        document.getElementById("taskInput").value = taskText;
        // Set selected category
        selectedCategory = category;
        document.getElementById(category === "School" ? "schoolBtn" : "personalBtn").style.opacity = "0.8";
        document.getElementById(category === "Personal" ? "schoolBtn" : "personalBtn").style.opacity = "1";
        // Change button text
        document.getElementById("addTask").textContent = "UPDATE TO-DO";
        // Set the ID of the task being edited
        editingTaskId = id;
    });

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", async function() {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            taskItem.remove();
        }
    });

    taskItem.appendChild(taskContent);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    document.getElementById("taskList").appendChild(taskItem);
}

// Load tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);
