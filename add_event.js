const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');

document.addEventListener('DOMContentLoaded', () => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(event => appendEventToList(event));
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const event = {
        id: Date.now(),
        title: document.getElementById('event-title').value,
        desc: document.getElementById('event-desc').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        category: document.getElementById('event-category').value,
        repeat: document.getElementById('event-repeat').value,
        status: "Pending"
    };

    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));

    appendEventToList(event);
    eventForm.reset();
});

function appendEventToList(event) {
    const li = document.createElement('li');
    li.setAttribute('data-id', event.id);

    updateEventDOM(li, event);

    appendButtons(li, event);

    eventList.appendChild(li);
}

function updateEventDOM(li, event) {
    li.innerHTML = `
        <span><strong>${event.title}</strong> — ${event.date} ${event.time ? 'at ' + event.time : ''} — ${event.category} — Repeat: ${event.repeat} — Location: ${event.location} — Status: <span class="status">${event.status}</span>
        ${event.desc ? `<br class="descLine"><span class="descLine">Description: ${event.desc}</span>` : ''}</span>
    `;
}

function appendButtons(li, event) {
    const oldActions = li.querySelector('.event-actions');
    if(oldActions) oldActions.remove();

    const actions = document.createElement('span');
    actions.className = 'event-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editBtn';
    editBtn.addEventListener('click', () => editEvent(event.id, li));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.addEventListener('click', () => {
        deleteEvent(event.id);
        li.remove();
    });

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Mark Done';
    completeBtn.className = 'completeBtn';
    completeBtn.addEventListener('click', () => markDone(event.id, li));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(completeBtn);

    li.appendChild(actions);
}

function deleteEvent(id) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
}

function markDone(id, li) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.map(e => {
        if(e.id === id){
            e.status = 'Done';
            updateEventDOM(li, e); 
            appendButtons(li, e);
        }
        return e;
    });
    localStorage.setItem('events', JSON.stringify(events));
}

// Edit event
function editEvent(id, li) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const index = events.findIndex(e => e.id === id);
    if(index === -1) return;

    const event = events[index];

    const newTitle = prompt("Edit Event Title:", event.title);
    const newDesc = prompt("Edit Description:", event.desc);
    const newDate = prompt("Edit Date (YYYY-MM-DD):", event.date);
    const newTime = prompt("Edit Time (HH:MM):", event.time);
    const newLocation = prompt("Edit Location:", event.location);
    const newCategory = prompt("Edit Category (Meeting/Birthday/Reminder/...):", event.category);
    const newRepeat = prompt("Edit Repeat Frequency (None/Daily/Weekly/Monthly/Yearly):", event.repeat);
    const newStatus = prompt("Edit Status (Pending/Done):", event.status);

    if(newTitle) event.title = newTitle;
    if(newDesc !== null) event.desc = newDesc;
    if(newDate) event.date = newDate;
    if(newTime !== null) event.time = newTime;
    if(newLocation) event.location = newLocation;
    if(newCategory) event.category = newCategory;
    if(newRepeat) event.repeat = newRepeat;
    if(newStatus) event.status = newStatus;

    // Save changes
    events[index] = event;
    localStorage.setItem('events', JSON.stringify(events));

    // Rebuild li DOM
    updateEventDOM(li, event);
    appendButtons(li, event); // re-add buttons
}
