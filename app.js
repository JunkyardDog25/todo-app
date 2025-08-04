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

const todos = localStorage.getItem("todos")
	? JSON.parse(localStorage.getItem("todos"))
	: [];

//Render existing todos from localStorage
todos.forEach((todo) => {
	const todoItem = new TodoItem(
		todo.text,
		todo.dateDue ? new Date(todo.dateDue) : null
	);
	const li = document.createElement("li");
	li.textContent = todoItem.getText();
	if (todoItem.getDateDue()) {
		li.textContent += ` (Due: ${todoItem.getDateDue().toLocaleDateString()})`;
	}
	todoList.appendChild(li);
});

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
	const li = document.createElement("li");

	li.textContent = todoItem.getText();
	if (todoItem.getDateDue()) {
		li.textContent += ` (Due: ${todoItem.getDateDue().toLocaleDateString()})`;
	}

	todoList.appendChild(li);

	// Save to localStorage
	todos.push(todoItem);
	localStorage.setItem("todos", JSON.stringify(todos));

	// Clear input fields
	todoInput.value = "";
	dateDueInput.value = "";
});
