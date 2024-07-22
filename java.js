const addbutton = document.getElementById("new-task");
const taskinput = document.getElementById("task-input");
const tasklist = document.getElementById("task-list");
const numbers = document.getElementById("numbers");
const progressBar = document.getElementById("progress");
const prioritySelect = document.getElementById("priority-select");

// Load tasks from local storage on page load
loadTask();
updateStats();  // Initialize stats on page load

// Event listener for adding a new task
addbutton.addEventListener('click', addTask);

// Function to add a new task
function addTask() {
    const task = taskinput.value.trim();
    const priority = prioritySelect.value; // get selected priority

    if (task) {
        createTaskElement(task, priority);
        taskinput.value = '';
        updateStats(); // Update stats after adding a new task
    } else {
        alert("Please enter a task!");
    }
}

// Function to create a task element in the list
function createTaskElement(task, priority) {
    const listitem = document.createElement('li');
    listitem.dataset.priority = priority; // Store priority level as a data attribute

    // Create and configure the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'taskCheckbox';

    // Create a span to hold the task text
    const taskText = document.createElement('span');
    taskText.textContent = task;

    // Edit button with an edit icon
    const editButton = document.createElement('button');
    editButton.className = 'editTask';

    const editIcon = document.createElement('img');
    editIcon.src = "edit.png"; // Set the path to your edit icon image
    editIcon.className = 'editIcon'; // Add a class for styling the icon

    editButton.appendChild(editIcon);

    // Delete button with a delete icon
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteTask';

    const deleteIcon = document.createElement('img');
    deleteIcon.src = "delete.png"; // Set the path to your delete icon image
    deleteIcon.className = 'deleteIcon'; // Add a class for styling the icon

    deleteButton.appendChild(deleteIcon);

    listitem.appendChild(checkbox);
    listitem.appendChild(taskText);
    listitem.appendChild(editButton);
    listitem.appendChild(deleteButton);
    
    tasklist.appendChild(listitem);

    // Event listener for deleting a task
    deleteButton.addEventListener('click', function() {
        const confirmation = confirm('Are you sure you want to delete this task?');
        if (confirmation) {
            tasklist.removeChild(listitem);
            saveTasks();
            updateStats(); // Update stats after deleting a task
        }
    });

    // Event listener for editing a task
    editButton.addEventListener('click', function() {
        const editField = document.createElement('input');
        editField.type = 'text';
        editField.value = taskText.textContent;
        editField.className = 'editField';

        listitem.replaceChild(editField, taskText);

        editField.addEventListener('blur', function() {
            taskText.textContent = editField.value.trim();
            listitem.replaceChild(taskText, editField);
            saveTasks();
        });

        editField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                editField.blur();
            }
        });

        editField.focus();
    });

    // Event listener for checkbox change
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            listitem.classList.add('completed');
            tasklist.appendChild(listitem); // To append the checked lists to the end of the unchecked list
        } else {
            listitem.classList.remove('completed');
        }
        saveTasks();
        updateStats(); // Update stats when a task is checked/unchecked
    });

    saveTasks();
}

// Function to save tasks to local storage
function saveTasks() {
    let tasks = [];
    tasklist.querySelectorAll('li').forEach(function(item) {
        tasks.push({
            name: item.querySelector('span').textContent.trim(),
            priority: item.dataset.priority // Save priority level
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTask() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.name, task.priority);
    });
}

// Function to update task statistics
function updateStats() {
    const totalTasks = tasklist.querySelectorAll('li').length;
    const completedTasks = tasklist.querySelectorAll('li.completed').length;
    numbers.textContent = `${completedTasks}/${totalTasks}`;
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    progressBar.style.width = `${progressPercent}%`;
}
