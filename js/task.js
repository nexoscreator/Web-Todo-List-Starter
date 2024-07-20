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
}


// Edit Task function
function editTask(id, newDescription) {
  const index = tasks.findIndex(task => task.id === id); // Find task index by ID
  if (index !== -1) {
    tasks[index].description = newDescription; // Update task description
    saveTasks(); // Save tasks to localStorage
    renderTasks(); // Update the UI
  }
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

// Delete Task function
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id); // Remove task from tasks array
  saveTasks(); // Save tasks to localStorage
  renderTasks(); // Update the UI
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

// Function to create task HTML element
function createTaskElement(task) {
  const taskElement = document.createElement('li');
  taskElement.id = `task-${task.id}`;
  taskElement.classList.add('task');

  const checkbox = document.createElement('input');
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

  // Add input field for editing task description
  const editInput = document.createElement('input');
  editInput.type = '';
  editInput.value = task.description;
  editInput.classList.add('edit-input');
  editInput.style.display = 'none';
  description.style.display = 'inline-block';
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newDescription = editInput.value.trim();
      if (newDescription !== '') {
        editTask(task.id, newDescription); // Call editTask function
      } else {
        alert('Task description cannot be empty.');
        editInput.value = task.description; // Reset input value
      }
    }
  });
  taskElement.appendChild(editInput);


  const taskmenu = document.createElement('div');
  taskmenu.classList.add('task-menu');
  taskmenu.innerHTML = `<input class="menu-input" type="checkbox" id="${task.id}" />
  <label class="menu-label" for="${task.id}">•••</label>`;
  taskElement.appendChild(taskmenu);


  const menulist = document.createElement('ul');
  taskmenu.appendChild(menulist);

  const uptask = document.createElement('li');
  uptask.innerHTML = `Up Task`;
  menulist.appendChild(uptask);

  const edittask = document.createElement('li');
  edittask.innerHTML = `Edit task`;
  menulist.appendChild(edittask);

  const downtask = document.createElement('li');
  downtask.innerHTML = `Down task`;
  menulist.appendChild(downtask);



  const deleteButton = document.createElement('li');
  deleteButton.innerHTML = `delete task`;
  deleteButton.addEventListener('click', () => deleteTask(task.id));
  menulist.appendChild(deleteButton);


  // Event listener for double-click to edit task description
  description.addEventListener('dblclick', () => {
    description.style.display = 'none';
    editInput.style.display = 'inline-block';
    editInput.focus();
  });

  // Event listener to save changes when input field loses focus
  editInput.addEventListener('blur', () => {
    const newDescription = editInput.value.trim();
    if (newDescription !== '') {
      editTask(task.id, newDescription); // Call editTask function
    } else {
      alert('Task description cannot be empty.');
      editInput.value = task.description; // Reset input value
    }
  });

  return taskElement;
}

// Function to render tasks
function renderTasks() {
  const taskListContainer = document.getElementById('taskList');
  taskListContainer.innerHTML = ''; // Clear existing tasks

  if (tasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('card');
    emptyMessage.innerHTML = `
      <h2>No Tasks to Display</h2>
      <img src="./assets/img/undraw_to_do_re_jaef.svg" />
      <p>It looks like your todo list is empty right now.
        Take a moment to relax, or start adding tasks to stay productive!
      </p>
    `;
    taskListContainer.appendChild(emptyMessage);
  } else {
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskListContainer.appendChild(taskElement);
    });
  }
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
  // Add your logic to handle task addition here
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

// Add event listener to the search input for capturing user input
searchInput.addEventListener('input', function() {

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter(task => {
    return task.description.toLowerCase().includes(searchInput); // Check if task description contains the search term
  });

  // Update the displayed task list with the filtered tasks
  displayTasks(filteredTasks);
});


// Show search form when button is clicked
const searchInputButton = document.getElementById('searchInputButton');
const searchForm = document.getElementById('searchForm');

searchInputButton.addEventListener('click', () => {
  searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
  searchForm.style.animation = 'fadeIn 0.3s ease-in-out';
  // Show the task form
  document.getElementById('searchInput').focus(); // Auto-focus on the input field
});

// Hide task form when form is submitted
searchForm.addEventListener('submit', event => {
  event.preventDefault(); // Prevent form submission
  taskForm.style.display = 'none'; // Hide the task form after submission
  // Add your logic to handle task addition here
});

function displayTasks(tasks) {
  const taskListContainer = document.getElementById('taskList'); // Get reference to the task list container element

  // Clear the task list container before adding filtered tasks
  taskListContainer.innerHTML = '';

  if (tasks.length === 0) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('card');
    taskElement.innerHTML = `
      <h2>No Results Found</h2>
      <img src="./assets/img/undraw_not_found_re_bh2e.svg" />
      <p>Oops! It seems like there are no tasks matching your search criteria. But don't worry, you can easily add new tasks to your to-do list or try refining your search to find what you're looking for.</p>
    `;
    taskListContainer.appendChild(taskElement);
  } else {
    // Loop through filtered tasks and create HTML elements to display each task
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskListContainer.appendChild(taskElement);
    });
  };
}


// Call displayTasks initially with all tasks
displayTasks(tasks);