import { TodoItem } from "./TodoItem.js";

const todoInput = document.querySelector("#todoInput");
const prioritySelect = document.querySelector("#prioritySelect");
const addButton = document.querySelector("#addTodoButton");
const filterSelect = document.querySelector("#filterSelect");

const todos = localStorage.getItem("todos")
	? JSON.parse(localStorage.getItem("todos"))
	: [];

window.onload = () => {
	// Initialize the todo list from localStorage
	renderTodos(todos);
};

// Event listener for adding a new todo item
addButton.addEventListener("click", () => {
	const todoText = todoInput.value.trim();
	const priority = prioritySelect.value;

	// Validate input
	if (!todoText) {
		alert("Please enter a todo item.");
		return;
	}

	// Create a new TodoItem and add it to the list
	const todoItem = new TodoItem(todoText, priority);
	createTodo(todoItem);
});

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

//Render existing todos from localStorage
function renderTodos(todos) {
	let html = "";
	todos.forEach((todo) => {
		html += `
		<div class="todo">
			<div class="input">
				<textarea disabled>${todo.text}</textarea>
				
				Priority:
				<select class="priority-select" disabled>
					<option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
					<option value="medium" ${
						todo.priority === "medium" ? "selected" : ""
					}>Medium</option>
					<option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
				</select>
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
	const prioritySelects = document.querySelectorAll(".input .priority-select");

	editButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			updateSections[i].style.display = "block";
			inputAreas[i].disabled = false;
			prioritySelects[i].disabled = false;
		});
	});
}

// Activate save buttons
function activateSaveButtons() {
	const saveButtons = document.querySelectorAll(".saveBtn");
	const inputAreas = document.querySelectorAll(".input textarea");
	const prioritySelects = document.querySelectorAll(".input .priority-select");

	saveButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			const updatedText = inputAreas[i].value.trim();
			console.log(prioritySelects[i]);

			const updatedPriority = prioritySelects[i].value;
			// Validate input
			if (!updatedText) {
				alert("Please enter a todo item.");
				return;
			}

			todos[i].text = updatedText;
			todos[i].priority = updatedPriority;
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
	const prioritySelects = document.querySelectorAll(".input .priority-select");

	cancelButtons.forEach((button, i) => {
		button.addEventListener("click", () => {
			updateSections[i].style.display = "none";
			inputAreas[i].disabled = true;
			prioritySelects[i].disabled = true;
		});
	});
}

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
