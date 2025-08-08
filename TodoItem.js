class TodoItem {
	static #id = 1;

	constructor(text, priority) {
		this.id = TodoItem.#id++;
		this.text = text;
		this.completed = false;
		this.priority = priority;
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
	getPriority() {
		return this.priority;
	}

	setText(text) {
		this.text = text;
	}
	setCompleted(completed) {
		this.completed = completed;
	}
	setPriority(priority) {
		this.priority = priority;
	}
}

export { TodoItem };
