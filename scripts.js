let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveData() {
  localStorage.setItem('subjects', JSON.stringify(subjects));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showPage(pageId) {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
  if (pageId === 'task') updateSubjectOptions();
  if (pageId === 'tasks') renderTasks();
  if (pageId === 'home') renderHome();
  if (pageId === 'task' && subjects.length === 0) {
    alert('No subjects available. Please add a subject first.');
    showPage('subject');
    return;
  }

}

function renderHome() {
  const homeDiv = document.getElementById('home');
  const taskPreview = tasks.filter(t => !t.done).slice(0, 3);
  let html = '<h1>Welcome to StudyBuddy!</h1>';
  if (subjects.length === 0) {
    html += '<p>You don\'t have any subjects yet.</p>';
    html += '<button class="btn btn-primary" onclick="showPage(\'subject\')">Add Your First Subject</button>';
  } else if (taskPreview.length === 0) {
    html += '<p>You\'re all caught up! No pending tasks.</p>';
  } else {
    html += '<h4>Your Upcoming Tasks</h4>';
    taskPreview.forEach(task => {
      html += `<div class="card task-card mb-2">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">Subject: ${task.subject}</p>
          <p class="card-text">Due: ${task.due}</p>
          <p class="card-text">Priority: ${task.priority}</p>
        </div>
      </div>`;
    });
  }
  homeDiv.innerHTML = html;
}

function addSubject() {
  const input = document.getElementById('subjectInput');
  const value = input.value.trim();
  if (value && !subjects.includes(value)) {
    subjects.push(value);
    saveData();
    input.value = '';
    document.getElementById('subjectMsg').textContent = 'Subject added!';
    setTimeout(() => document.getElementById('subjectMsg').textContent = '', 2000);
    updateSubjectOptions();
  }
}

function updateSubjectOptions() {
  const select = document.getElementById('subjectSelect');
  select.innerHTML = '';
  subjects.forEach(subj => {
    const opt = document.createElement('option');
    opt.value = subj;
    opt.textContent = subj;
    select.appendChild(opt);
  });
}


function addTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const subject = document.getElementById('subjectSelect').value;
  const due = document.getElementById('taskDue').value;
  const priority = document.getElementById('taskPriority').value;

  if (title && subject && due) {
    tasks.push({ title, subject, due, priority, done: false });
    saveData();
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDue').value = '';
    document.getElementById('taskPriority').value = 'Low';
    document.getElementById('taskMsg').textContent = 'Task added!';
    setTimeout(() => document.getElementById('taskMsg').textContent = '', 2000);
    updateSubjectOptions();
  } else {
    alert('Please fill out all fields including the date.');
  }
}
function renderTasks() {
  const container = document.getElementById('taskList');
  container.innerHTML = '';
  if (tasks.length === 0) {
    container.innerHTML = '<p>No tasks added yet.</p>';
    return;
  }
  tasks.forEach((task, index) => {
    const card = document.createElement('div');
    card.className = 'card task-card';
    card.innerHTML = `
      <div class="card-body ${task.done ? 'completed' : ''}">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">Subject: ${task.subject}</p>
        <p class="card-text">Due: ${task.due}</p>
        <p class="card-text">Priority: ${task.priority}</p>
        ${!task.done ? `<button class="btn btn-success" onclick="completeTask(${index})">Mark as Done</button>` : '<span class="text-muted">Completed</span>'}
      </div>`;
    container.appendChild(card);
  });
}

function completeTask(index) {
  tasks[index].done = true;
  saveData();
  renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
  updateSubjectOptions();
  renderHome();
});


document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('taskDue');
  const test = document.createElement('input');
  test.setAttribute('type', 'date');
  const isDateSupported = test.type === 'date';

  if (!isDateSupported) {
    dateInput.type = 'text';
    dateInput.placeholder = 'YYYY-MM-DD';
    dateInput.addEventListener('focus', () => {
      if (!dateInput.value) {
        const value = prompt('Enter a date (YYYY-MM-DD):');
        if (value) dateInput.value = value;
      }
    });
  }
});
