const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => appendTaskToList(task));
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        desc: document.getElementById('task-desc').value,
        dueDate: document.getElementById('due-date').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    appendTaskToList(task);
    taskForm.reset();
});

function appendTaskToList(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);

    const taskText = document.createElement('span');
    taskText.innerHTML = `<strong>${task.title}</strong> — Due: ${task.dueDate} — Priority: ${task.priority} — Status: <span class="status">${task.status}</span>`;
    if(task.desc) {
        const br = document.createElement('br');
        const descSpan = document.createElement('span');
        descSpan.className = 'descLine';
        descSpan.textContent = `Description: ${task.desc}`;
        taskText.appendChild(br);
        taskText.appendChild(descSpan);
    }

    const actionsSpan = document.createElement('span');
    actionsSpan.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editBtn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Mark Complete';
    completeBtn.className = 'completeBtn';

    actionsSpan.appendChild(editBtn);
    actionsSpan.appendChild(deleteBtn);
    actionsSpan.appendChild(completeBtn);

    li.appendChild(taskText);
    li.appendChild(actionsSpan);
    taskList.appendChild(li);

    editBtn.addEventListener('click', () => editTask(task.id, li));
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
        li.remove();
    });
    completeBtn.addEventListener('click', () => markComplete(task.id, li));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function markComplete(id, li) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if(task.id === id){
            task.status = 'Completed';
            li.querySelector('.status').textContent = 'Completed';
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(id, li) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex === -1) return;

    const task = tasks[taskIndex];

    const newTitle = prompt("Edit Task Title:", task.title);
    const newDesc = prompt("Edit Description:", task.desc);
    const newDueDate = prompt("Edit Due Date (YYYY-MM-DD):", task.dueDate);
    const newPriority = prompt("Edit Priority (Low/Medium/High):", task.priority);
    const newStatus = prompt("Edit Status (Pending/In Progress/Completed):", task.status);

    if(newTitle) task.title = newTitle;
    if(newDesc !== null) task.desc = newDesc;
    if(newDueDate) task.dueDate = newDueDate;
    if(newPriority) task.priority = newPriority;
    if(newStatus) task.status = newStatus;

    tasks[taskIndex] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskText = li.querySelector('span:first-child');
    taskText.innerHTML = `<strong>${task.title}</strong> — Due: ${task.dueDate} — Priority: ${task.priority} — Status: <span class="status">${task.status}</span>`;
    if(task.desc) {
        const br = document.createElement('br');
        const descSpan = document.createElement('span');
        descSpan.className = 'descLine';
        descSpan.textContent = `Description: ${task.desc}`;
        taskText.appendChild(br);
        taskText.appendChild(descSpan);
    }
}
