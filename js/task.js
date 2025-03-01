// Task object structure
function Task(id, description, completed) {
  this.id = id;
  this.description = description;
  this.completed = completed;
}

// Task management functions
let tasks = []; // Array to store tasks

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks(); // Load tasks from localStorage
  renderTasks(); // Render tasks on page load
});

// Add Task function
function addTask(description) {
  const id = Date.now(); // Generate unique ID
  const task = new Task(id, description, false); // Create new task object
  tasks.push(task); // Add task to the tasks array
  saveTasks(); // Save tasks to localStorage
  renderTasks(); // Update the UI

  // Find the newly added task element and add the animation class
  const taskElement = document.getElementById(`task-${id}`);
  animateTask(taskElement, 'add');
}

// Toggle Completion function
function toggleCompletion(id) {
  const index = tasks.findIndex(task => task.id === id); // Find task index by ID
  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed; // Toggle task completion status
    saveTasks(); // Save tasks to localStorage
    renderTasks(); // Update the UI
  }
}

function moveTaskUp(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index > 0) {
    const taskElement = document.getElementById(`task-${id}`);
    const previousTaskElement = document.getElementById(`task-${tasks[index - 1].id}`);

    animateTask(taskElement, 'up');
    animateTask(previousTaskElement, 'down');

    setTimeout(() => {
      const [task] = tasks.splice(index, 1);
      tasks.splice(index - 1, 0, task);
      saveTasks();
      updateTaskList();
    }, 300); // Wait for the animation to complete
  }
}

// Function to move tasks
function moveTaskDown(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index < tasks.length - 1) {
    const taskElement = document.getElementById(`task-${id}`);
    const nextTaskElement = document.getElementById(`task-${tasks[index + 1].id}`);

    animateTask(taskElement, 'down');
    animateTask(nextTaskElement, 'up');

    setTimeout(() => {
      const [task] = tasks.splice(index, 1);
      tasks.splice(index + 1, 0, task);
      saveTasks();
      updateTaskList();
    }, 300); // Wait for the animation to complete
  }
}

// Function to edit tasks
function editTask(id, newDescription) {
  // Update the task description in the tasks array
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1 && newDescription.trim() !== '') {
    tasks[index].description = newDescription;
    saveTasks(); // Save tasks to localStorage
    renderTasks(); // Update the UI
  }
}


// Function to delete tasks
function deleteTask(id) {
  const taskElement = document.getElementById(`task-${id}`);
  animateTask(taskElement, 'delete');

  setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateTaskList();
  }, 300); // Wait for the animation to complete
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to retrieve tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to create task
function createTaskElement(task) {
  const taskElement = document.createElement('li');
  taskElement.id = `task-${task.id}`;
  taskElement.classList.add('task');

  const checkbox = document.createElement('input');
  checkbox.id = `check-${task.id}`;
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleCompletion(task.id));
  taskElement.appendChild(checkbox);

  const description = document.createElement('p');
  description.textContent = task.description;
  if (task.completed) {
    description.classList.add('description');
  }
  taskElement.appendChild(description);

  const editInput = document.createElement('input');
  editInput.id = `edit-${task.id}`;
  editInput.type = 'text';
  editInput.value = task.description;
  editInput.classList.add('edit-input');
  editInput.style.display = 'none';
  description.style.display = 'inline-block';
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newDescription = editInput.value.trim();
      if (newDescription !== '') {
        editTask(task.id, newDescription);
      } else {
        alert('Task description cannot be empty.');
        editInput.value = task.description;
      }
    }
  });
  taskElement.appendChild(editInput);

  const taskMenu = document.createElement('div');
  taskMenu.classList.add('task-menu');
  taskMenu.innerHTML = `
    <input class="menu-input" type="checkbox" id="menu-${task.id}" />
    <label class="menu-label" for="menu-${task.id}">•••</label>
    <ul class="menu-list">
      <li onclick="moveTaskUp(${task.id})">Up Task</li>
      <li onclick="editTask(${task.id})">Edit Task</li>
      <li onclick="moveTaskDown(${task.id})">Down Task</li>
      <li onclick="deleteTask(${task.id})">Delete Task</li>
    </ul>
  `;
  taskElement.appendChild(taskMenu);

  description.addEventListener('dblclick', () => {
    description.style.display = 'none';
    editInput.style.display = 'inline-block';
    editInput.focus();
  });

  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newDescription = editInput.value.trim();
      if (newDescription !== '') {
        editTask(task.id, newDescription);
      } else {
        alert('Task description cannot be empty.');
        editInput.value = task.description;
      }
    }
  });

  editInput.addEventListener('blur', () => {
    const newDescription = editInput.value.trim();
    if (newDescription !== '') {
      editTask(task.id, newDescription);
    } else {
      alert('Task description cannot be empty.');
      editInput.value = task.description;
    }
    editInput.style.display = 'none';
    description.style.display = 'inline-block';
  });

  return taskElement;
}

// Function to render tasks
function renderTasks() {
  const taskListContainer = document.getElementById('taskList');
  const fragment = document.createDocumentFragment();

  if (tasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('card');
    emptyMessage.innerHTML = `
      <h2>No Tasks to Display</h2>
      <img src="./assets/img/undraw_to_do_re_jaef.svg" loading="lazy" />
      <p>It looks like your todo list is empty right now.
        Take a moment to relax, or start adding tasks to stay productive!
      </p>
    `;
    fragment.appendChild(emptyMessage);
  } else {
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      fragment.appendChild(taskElement);
    });
  }

  taskListContainer.innerHTML = '';
  taskListContainer.appendChild(fragment);
}

// Function to update task list
function updateTaskList() {
  renderTasks();
}

// Function to animate tasks
function animateTask(taskElement, animationClass) {
  taskElement.classList.add(animationClass);
  setTimeout(() => {
    taskElement.classList.remove(animationClass);
  }, 300); // Match the duration of the animation
}

// Show task form when button is clicked
const taskInputButton = document.getElementById('taskInputButton');
const taskForm = document.getElementById('taskForm');

taskInputButton.addEventListener('click', () => {
  taskForm.style.display = taskForm.style.display === 'none' ? 'block' : 'none'; // Show the task form
  taskForm.style.animation = 'fadeIn 0.3s ease-in-out';
  document.getElementById('taskInput').focus(); // Auto-focus on the input field
});

// Hide task form when form is submitted
taskForm.addEventListener('submit', event => {
  event.preventDefault(); // Prevent form submission
  taskForm.style.display = 'none'; // Hide the task form after submission
  const taskInput = document.getElementById('taskInput');
  const taskDescription = taskInput.value.trim();
  if (taskDescription !== '') {
    addTask(taskDescription);
    taskInput.value = ''; // Clear input field
  } else {
    alert('Please enter a valid task description.');
  }
});

// Get reference to the search input element
const searchInput = document.getElementById('searchInput');

let debounceTimeout;
// Add event listener to the search input for capturing user input
searchInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(task => task.description.toLowerCase().includes(searchTerm));
    displayTasks(filteredTasks);
  }, 300); // Adjust debounce delay as needed
});

// Show search form when button is clicked
const searchInputButton = document.getElementById('searchInputButton');
const searchForm = document.getElementById('searchForm');

searchInputButton.addEventListener('click', () => {
  searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
  searchForm.style.animation = 'fadeIn 0.3s ease-in-out';
  document.getElementById('searchInput').focus(); // Auto-focus on the input field
});

// Hide search form when form is submitted
searchForm.addEventListener('submit', event => {
  event.preventDefault(); // Prevent form submission
  searchForm.style.display = 'none'; // Hide the search form after submission
});


function displayTasks(tasks) {
  const taskListContainer = document.getElementById('taskList');
  const fragment = document.createDocumentFragment();

  if (tasks.length === 0) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('card');
    taskElement.innerHTML = `
      <h2>No Results Found</h2>
      <img src="./assets/img/undraw_not_found_re_bh2e.svg" loading="lazy"/>
      <p>Oops! It seems like there are no tasks matching your search criteria. But don't worry, you can easily add new tasks to your to-do list or try refining your search to find what you're looking for.</p>
    `;
    fragment.appendChild(taskElement);
  } else {
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      fragment.appendChild(taskElement);
    });
  }

  taskListContainer.innerHTML = '';
  taskListContainer.appendChild(fragment);
}

// Call displayTasks initially with all tasks
displayTasks(tasks);