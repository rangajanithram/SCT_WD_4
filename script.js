document.getElementById('add-task-btn').addEventListener('click', addTask);

// Load tasks from localStorage when the page loads
window.onload = loadTasks;

function addTask() {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('task-due-date');
    const errorMessage = document.getElementById('error-message');
    const taskList = document.getElementById('task-list');

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    // Clear previous error message
    errorMessage.textContent = '';

    // Validate input
    if (!taskText) {
        errorMessage.textContent = 'Please enter a task.';
        return;
    }

    // Create a new task object
    const task = {
        text: taskText,
        dueDate: dueDate,
        completed: false
    };

    // Get existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task); // Add the new task to the array

    // Save updated tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Append the new task to the list
    appendTaskToList(task);

    // Clear input fields
    taskInput.value = '';
    dueDateInput.value = '';
}

function appendTaskToList(task) {
    const taskList = document.getElementById('task-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div>
            <span>${task.text}</span>
            ${task.dueDate ? `<div style="color: #888;">Due: ${new Date(task.dueDate).toLocaleString()}</div>` : ''}
        </div>
        <div>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="toggleComplete(this)">Complete</button>
            <button onclick="removeTask(this)">Remove</button>
        </div>
    `;
    if (task.completed) {
        listItem.classList.add('completed');
    }
    taskList.appendChild(listItem);
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        appendTaskToList(task);
    });
}

function toggleComplete(button) {
    const listItem = button.closest('li');
    listItem.classList.toggle('completed');

    // Update the task's completed status in localStorage
    updateTaskStatus(listItem);
}

function editTask(button) {
    const listItem = button.closest('li');
    const taskText = listItem.querySelector('span').textContent.split(' - ')[0];
    const dueDateInput = listItem.querySelector('div div').textContent.includes('Due:') 
        ? new Date(listItem.querySelector('div div').textContent.split('Due: ')[1]).toISOString().slice(0, 16) 
        : '';

    const taskInput = document.getElementById('task-input');
    const dueDateInputField = document.getElementById('task-due-date');

    taskInput.value = taskText;
    dueDateInputField.value = dueDateInput;

    removeTask(button);
}

function removeTask(button) {
    const listItem = button.closest('li');
    const taskText = listItem.querySelector('span').textContent;

    // Get existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== taskText); // Remove the task

    // Save updated tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    listItem.remove();
}

function updateTaskStatus(listItem) {
    const taskText = listItem.querySelector('span').textContent;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.text === taskText);
    if (task) {
        task.completed = listItem.classList.contains(' completed');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}