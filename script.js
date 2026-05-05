// Task Manager Application
// Skills: HTML, CSS, JavaScript (DOM, Local Storage, Array Methods)

// Global variables
let tasks = [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('totalTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
});

// Add task
addBtn.addEventListener('click', () => {
    const title = taskInput.value.trim();
    
    if (title === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
});

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current filter
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = [];
    
    if (currentFilter === 'all') {
        filteredTasks = tasks;
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No tasks to show</div>';
        return;
    }
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</span>
            <button class="edit-btn">✏️ Edit</button>
            <button class="delete-btn">🗑️ Delete</button>
        `;
        
        // Checkbox event
        const checkbox = li.querySelector('.task-check');
        checkbox.addEventListener('change', () => {
            toggleComplete(task.id);
        });
        
        // Edit button event
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            editTask(task.id);
        });
        
        // Delete button event
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newTitle = prompt('Edit task:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            saveTasks();
            renderTasks();
        }
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksSpan.textContent = total;
    pendingTasksSpan.textContent = pending;
    completedTasksSpan.textContent = completed;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Add sample tasks for demo
        tasks = [
            { id: Date.now() + 1, title: 'Learn HTML/CSS', completed: true, createdAt: new Date().toISOString() },
            { id: Date.now() + 2, title: 'Build Task Manager project', completed: false, createdAt: new Date().toISOString() },
            { id: Date.now() + 3, title: 'Practice interview questions', completed: false, createdAt: new Date().toISOString() }
        ];
    }
}

// Helper function to prevent XSS attacks
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}