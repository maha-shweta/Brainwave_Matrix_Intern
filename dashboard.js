const greetingEl = document.getElementById('greeting');

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadEvents();
    renderCharts();
    
    const refreshBtn = document.getElementById("refreshBtn");
    if(refreshBtn){
        refreshBtn.addEventListener("click", () => {
            loadTasks();
            loadEvents();
            renderCharts();
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }
});

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (!loggedInUser) {
    alert('You are not logged in! Redirecting to login page.');
    window.location.href = 'login.html';
} else {
    greetingEl.textContent = `Hello, ${loggedInUser.username}!`;
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const pendingTasksUL = document.getElementById('pendingTasks');

    pendingTasksUL.innerHTML = "";

    let pendingTasks = tasks.filter(t => t.status !== 'Completed');

    if (pendingTasks.length === 0) {
        pendingTasksUL.innerHTML = '<li>No pending tasks!</li>';
        return;
    }

    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    pendingTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    pendingTasks.forEach(task => {
        const li = document.createElement('li');
        let color = 'black';
        if (task.priority === 'High') color = 'red';
        else if (task.priority === 'Medium') color = 'orange';
        else if (task.priority === 'Low') color = 'green';

        li.style.color = color;
        li.textContent = `${task.title} — Due: ${task.dueDate} — Priority: ${task.priority} — Status: ${task.status}`;
        pendingTasksUL.appendChild(li);
    });
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const categoryMap = {
        "birthday": "birthdayList",
        "meeting": "meetingList",
        "reminder": "reminderList",
        "appointment": "appointmentList",
        "other": "otherList"
    };

    Object.values(categoryMap).forEach(id => {
        const ul = document.getElementById(id);
        if (ul) ul.innerHTML = "";
    });

    const upcoming = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate <= nextWeek;
    });

    if (upcoming.length === 0) {
        const otherList = document.getElementById("otherList");
        if(otherList) otherList.innerHTML = "<li>No upcoming events 🎉</li>";
        return;
    }

    upcoming.forEach(ev => {
        const li = document.createElement("li");
        li.textContent = `${ev.title} — ${ev.date}${ev.time ? " at " + ev.time : ""} — ${ev.status}`;

        const categoryKey = ev.category ? ev.category.toLowerCase() : "other";

        let listId = categoryMap[categoryKey] || "otherList";
        let color;
        switch(categoryKey) {
            case "birthday": color = "purple"; break;
            case "meeting": color = "blue"; break;
            case "reminder": color = "orange"; break;
            case "appointment": color = "teal"; break;
            default: color = "gray";
        }

        li.style.color = color;
        const ul = document.getElementById(listId);
        if(ul) ul.appendChild(li);
    });
}

function renderCharts() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;

    const events = JSON.parse(localStorage.getItem('events')) || [];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const upcomingEvents = events.filter(ev => {
        const evDate = new Date(ev.date);
        return evDate >= today && evDate <= nextWeek;
    });
    const doneEvents = upcomingEvents.filter(e => e.status === 'Done').length;
    const pendingEvents = upcomingEvents.length - doneEvents;

    new Chart(document.getElementById('taskChart'), {
        type: 'pie',
        data: {
            labels: ['Pending', 'Completed'],
            datasets: [{
                data: [pendingTasks, completedTasks],
                backgroundColor: ['orange', 'green']
            }]
        }
    });

    new Chart(document.getElementById('eventChart'), {
        type: 'pie',
        data: {
            labels: ['Pending', 'Done'],
            datasets: [{
                data: [pendingEvents, doneEvents],
                backgroundColor: ['blue', 'purple']
            }]
        }
    });
}
