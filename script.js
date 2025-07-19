window.onload = loadTasks;

function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  if (task === "") return;

  const tasks = getTasks();
  tasks.push({ name: task, completed: false });
  saveTasks(tasks);
  input.value = "";
  renderTasks();
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function startEditTask(index) {
  const taskList = document.getElementById("taskList");
  const li = taskList.children[index];
  li.classList.add("editing");

  // Buat input edit
  let input = li.querySelector("input.edit-input");
  if (!input) {
    input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = getTasks()[index].name;
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        finishEditTask(index, input.value);
      }
      if (e.key === "Escape") {
        cancelEditTask(index);
      }
    });
    li.insertBefore(input, li.firstChild);
  }
  input.focus();
  input.select();
}

function finishEditTask(index, newName) {
  newName = newName.trim();
  if (newName === "") return; // jangan update nama kosong

  const tasks = getTasks();
  tasks[index].name = newName;
  saveTasks(tasks);
  renderTasks();
}

function cancelEditTask(index) {
  const taskList = document.getElementById("taskList");
  const li = taskList.children[index];
  li.classList.remove("editing");
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasks = getTasks();
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.style.display = "flex";
    li.style.alignItems = "center";

    // Nama task (span)
    const nameSpan = document.createElement("span");
    nameSpan.textContent = task.name;
    nameSpan.className = "task-name";
    nameSpan.onclick = () => toggleTask(i);

    // Tombol toggle selesai
    const toggleSpan = document.createElement("span");
    toggleSpan.innerHTML = task.completed ? "✔" : "✖";
    toggleSpan.className = "icon-button";
    toggleSpan.title = "Toggle complete";
    toggleSpan.onclick = (e) => {
      e.stopPropagation();
      toggleTask(i);
    };

    // Tombol edit
    const editSpan = document.createElement("span");
    editSpan.innerHTML = "✏️";
    editSpan.className = "icon-button";
    editSpan.title = "Edit task";
    editSpan.onclick = (e) => {
      e.stopPropagation();
      startEditTask(i);
    };

    // Tombol delete
    const deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "🗑️";
    deleteSpan.className = "icon-button";
    deleteSpan.title = "Delete task";
    deleteSpan.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Are you sure to delete this task?")) {
        deleteTask(i);
      }
    };

    li.appendChild(nameSpan);
    li.appendChild(toggleSpan);
    li.appendChild(editSpan);
    li.appendChild(deleteSpan);

    taskList.appendChild(li);
  });
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}
