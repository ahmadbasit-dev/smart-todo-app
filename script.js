const todoForm = document.querySelector("form");
const formInput = document.querySelector("#task__input");
const todoList = document.querySelector(".to-do__list");
const addBtn = document.querySelector(".add__btn");
const addBtnIcon = addBtn.querySelector("i");
const counter = document.querySelector(".task__count");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingId = null;
let currentFilter = "all";

/* SAVE */

const saveToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

/*  RENDER  */
const renderTasks = () => {
  todoList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  if (filteredTasks.length === 0) {
    let message = "";

    if (currentFilter === "all") {
      message = "No tasks yet. Start adding one 🚀";
    }

    if (currentFilter === "active") {
      message = "No active tasks. You're crushing it 🔥";
    }

    if (currentFilter === "completed") {
      message = "No completed tasks yet 💪";
    }

    todoList.innerHTML = `
      <div class="empty">
        <p>${message}</p>
      </div>
    `;

    updateCounter();
    return;
  }

  filteredTasks.forEach((task) => {
    todoList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="to-do__item ${task.completed ? "completed" : ""}" data-id="${
        task.id
      }">
        <div class="task__text">
          <input type="checkbox" class="checkbox" ${
            task.completed ? "checked" : ""
          }/>
          <span class="span">${task.text}</span>
        </div>
        <div class="task__btns">
          <button class="btn btn__edit">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn btn__delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
      `
    );

    formInput.value = "";
  });

  updateCounter();
};

/* COUNTER */

const updateCounter = () => {
  if (!counter) return;

  const totalTask = tasks.length;
  const messageEl = document.querySelector(".progress__message");
  const completedTasks = tasks.filter((task) => task.completed).length;
  const percent = totalTask ? (completedTasks / totalTask) * 100 : 0;
  counter.textContent = `${completedTasks}/${totalTask}`;

  const prograss = document.querySelector(".progaras_bar");

  prograss.style.width = totalTask
    ? `${(completedTasks / totalTask) * 100}%`
    : "0%";

  if (totalTask === 0) {
    messageEl.textContent = "Start your journey 🚀";
  } else if (percent === 100) {
    messageEl.textContent = "All tasks completed! 🎉";
  } else if (percent >= 60) {
    messageEl.textContent = "Almost there! 🔥";
  } else if (percent >= 20) {
    messageEl.textContent = "Keep it going 💪";
  } else {
    messageEl.textContent = "Keep it up!";
  }
};

/* ADD / UPDATE */

const handleSubmit = () => {
  const text = formInput.value.trim();
  if (!text) return;

  if (editingId) {
    const task = tasks.find((task) => task.id === editingId);
    task.text = text;
    editingId = null;

    addBtnIcon.className = "fa-solid fa-plus";
  } else {
    tasks.push({
      id: Date.now(),
      text,
      completed: false,
    });
  }

  saveToLocalStorage();
  renderTasks();
  formInput.value = "";
};

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

/* LIST EVENTS */

todoList.addEventListener("click", (e) => {
  const item = e.target.closest(".to-do__item");
  if (!item) return;

  const id = Number(item.dataset.id);

  /* DELETE */
  if (e.target.closest(".btn__delete")) {
    item.classList.add("fade-out");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveToLocalStorage();
      renderTasks();
    }, 300);
  }

  /* COMPLETE */
  if (e.target.closest(".checkbox")) {
    const task = tasks.find((task) => task.id === id);
    task.completed = !task.completed;
    saveToLocalStorage();
    renderTasks();
  }

  /* EDIT */
  if (e.target.closest(".btn__edit")) {
    const task = tasks.find((task) => task.id === id);

    formInput.value = task.text;
    formInput.focus();

    editingId = id;

    addBtnIcon.className = "fa-solid fa-check";
  }
});

/* FILTER */

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
