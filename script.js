// Elementos da interface
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const themeSelect = document.getElementById('theme-select');

let tasks = [];

// Carrega as tarefas salvas do localStorage
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

// Salva a lista atual de tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Atualiza a lista na tela
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        const label = document.createElement('label');
        label.textContent = task.text;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.className = 'delete-button';
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Aplica o tema selecionado (claro, escuro ou sistema)
function applyTheme(theme) {
    if (theme === 'system') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Carrega a preferência de tema salva
function loadTheme() {
    const stored = localStorage.getItem('theme') || 'system';
    themeSelect.value = stored;
    applyTheme(stored);
}

// Adiciona uma nova tarefa na lista
addButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    const newTask = {
        id: Date.now(),
        text,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
});

// Permite adicionar tarefas pressionando Enter
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        addButton.click();
    }
});

// Alteração do tema pela interface
themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

loadTasks();
loadTheme();
renderTasks();
