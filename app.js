class TodoItem {
	static #id = 1;

	constructor(text, dateDue = null) {
		this.id = TodoItem.#id++;
		this.text = text;
		this.completed = false;
		this.dateDue = dateDue;
	}

	getId() {
		return this.id;
	}
	getText() {
		return this.text;
	}
	getCompleted() {
		return this.completed;
	}
	getDateDue() {
		return this.dateDue;
	}

	setText(text) {
		this.text = text;
	}
	setCompleted(completed) {
		this.completed = completed;
	}
	setDateDue(dateDue) {
		this.dateDue = dateDue;
	}
}

const todoInput = document.querySelector("#todoInput");
const dateDueInput = document.querySelector("#dateInput");
const addButton = document.querySelector("#addTodoButton");
const todoList = document.querySelector("#todoList");
const filterSelect = document.querySelector("#filterSelect");

window.onload = () => {
	// Initialize the todo list from localStorage
	renderTodos(todos);
};

const todos = localStorage.getItem("todos")
	? JSON.parse(localStorage.getItem("todos")).map((todo) => ({
			...todo,
			dateDue: todo.dateDue ? new Date(todo.dateDue) : null,
	  }))
	: [];

//Render existing todos from localStorage
function renderTodos(todos) {
	console.log(todos);
	let html = "";
	todos.forEach((todo) => {
		html += `<div class="todo">
			<div class="input">
				<textarea disabled>${todo.text}</textarea>
				
				${
					todo.dateDue
						? `<span>Due:</span> <input disabled class="date-input" type="date" value="${
								todo.dateDue.toISOString().split("T")[0]
						  }"/>`
						: `<input class="edit-date-input" type="date"/>`
				}
				<div class="edit">
					<i style="cursor: pointer;" class="bi bi-trash-fill"></i>
					<i style="cursor: pointer;" class="bi bi-pencil-fill"></i>
					<input class="completed" type="checkbox" class="checkbox" ${
						todo.completed ? "checked" : ""
					} />
				</div>
			</div>
				</div>
			</div>
			<div class="update">
				<button class="btn btn-success saveBtn">Save</button>
				<button class="btn btn-secondary cancelBtn">Cancel</button>
			</div>
		</div>`;
	});
	document.querySelector("#list-container").innerHTML = html;

	activateDeleteButtons();
	activateEditButtons();
	activateSaveButtons();
	activateCancelButtons();
	activateCompletionButtons();
}

// Activate delete buttons
function activateDeleteButtons() {
	const deleteButtons = document.querySelectorAll(".bi-trash-fill");
	deleteButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			deleteTodo(i);
		});
	});
}

// Delete a todo item
function deleteTodo(index) {
	todos.splice(index, 1);
	localStorage.setItem("todos", JSON.stringify(todos));
	location.reload();
}

// Activate edit buttons
function activateEditButtons() {
	const editButtons = document.querySelectorAll(".bi-pencil-fill");
	const updateSections = document.querySelectorAll(".update");
	const inputAreas = document.querySelectorAll(".input textarea");
	const dateInputs = document.querySelectorAll(".input .date-input");
	const editDateInputs = document.querySelectorAll(".input .edit-date-input");

	editButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			updateSections[i].style.display = "block";
			inputAreas[i].disabled = false;
			if (dateInputs[i]) {
				dateInputs[i].disabled = false;
			} else {
				if (editDateInputs[i]) {
					editDateInputs[i].style.display = "block";
				}
			}
		});
	});
}

// Activate save buttons
function activateSaveButtons() {
	const saveButtons = document.querySelectorAll(".saveBtn");
	const inputAreas = document.querySelectorAll(".input textarea");
	const dateInputs = document.querySelectorAll(".input .date-input");
	const editDateInputs = document.querySelectorAll(".input .edit-date-input");

	saveButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			const updatedText = inputAreas[i].value.trim();
			console.log(dateInputs[i]);

			const updatedDate = dateInputs[i] ? new Date(dateInputs[i].value) : null;
			// Validate input
			if (!updatedText) {
				alert("Please enter a todo item.");
				return;
			}
			// Check if the due date is in the past
			if (updatedDate && updatedDate < new Date()) {
				alert("Please enter a due date in the future.");
				return;
			}

			if (!updatedDate) {
				if (editDateInputs[i]) {
					todos[i].dateDue = editDateInputs[i].value;
				}
			} else {
				todos[i].dateDue = updatedDate;
			}

			todos[i].text = updatedText;
			localStorage.setItem("todos", JSON.stringify(todos));
			location.reload();
		});
	});
}

// Activate cancel buttons
function activateCancelButtons() {
	const cancelButtons = document.querySelectorAll(".cancelBtn");
	const updateSections = document.querySelectorAll(".update");
	const inputAreas = document.querySelectorAll(".input textarea");
	const dateInputs = document.querySelectorAll(".input .date-input");
	const editDateInputs = document.querySelectorAll(".input .edit-date-input");

	cancelButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			updateSections[i].style.display = "none";
			inputAreas[i].disabled = true;
			if (dateInputs[i]) {
				dateInputs[i].disabled = true;
			}
			if (editDateInputs[i]) {
				editDateInputs[i].style.display = "none";
			}
		});
	});
}

// Event listener for adding a new todo item
addButton.addEventListener("click", () => {
	const todoText = todoInput.value.trim();
	const dateDue = dateDueInput.value ? new Date(dateDueInput.value) : null;

	// Validate input
	if (!todoText) {
		alert("Please enter a todo item.");
		return;
	}
	// Check if the due date is in the past
	if (dateDue && dateDue < new Date()) {
		alert("Please enter a due date in the future.");
		return;
	}

	// Create a new TodoItem and add it to the list
	const todoItem = new TodoItem(todoText, dateDue);
	createTodo(todoItem);
});

// Activate completion buttons
function activateCompletionButtons() {
	const completionCheckboxes = document.querySelectorAll(".edit .completed");
	const inputAreas = document.querySelectorAll(".input textarea");
	completionCheckboxes.forEach((checkbox, i) => {
		checkbox.addEventListener("change", () => {
			if (!todos[i].completed) {
				inputAreas[i].style.textDecoration = "line-through";
			} else {
				inputAreas[i].style.textDecoration = "none";
			}
			todos[i].completed = checkbox.checked;
			localStorage.setItem("todos", JSON.stringify(todos));
		});
	});
}

function createTodo(todo) {
	todos.push(todo);
	localStorage.setItem("todos", JSON.stringify(todos));
	location.reload();
}

// Filter todos based on completion status
filterSelect.addEventListener("change", () => {
	const filterValue = filterSelect.value;
	let filteredTodos = todos;

	if (filterValue === "completed") {
		filteredTodos = todos.filter((todo) => todo.completed);
	} else if (filterValue === "pending") {
		filteredTodos = todos.filter((todo) => !todo.completed);
	}

	renderTodos(filteredTodos);
});
