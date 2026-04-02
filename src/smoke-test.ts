import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '..', 'tasks.json');

interface Task {
    id: string;
    description: string;
    completed: boolean;
}

// Helper to clear data for tests
function clearTasks() {
    try {
        if (readFileSync(DATA_FILE)) {
            unlinkSync(DATA_FILE);
        }
    } catch (error) {
        // Ignore if file doesn't exist
    }
}

// Smoke test: add a task, list it, complete it, delete it.
function runSmokeTest() {
    console.log("Running smoke test...");

    // Ensure data file is clear before starting
    clearTasks();

    // 1. Add a task
    const newTask: Task = { id: '1', description: 'Buy groceries', completed: false };
    writeFileSync(DATA_FILE, JSON.stringify([newTask]));
    console.log("Added task:", newTask.description);

    // 2. List tasks
    const tasks = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    console.log("Current tasks:", tasks);
    if (tasks.length !== 1 || tasks[0].description !== 'Buy groceries') {
        throw new Error("List tasks failed!");
    }

    // 3. Complete a task
    tasks[0].completed = true;
    writeFileSync(DATA_FILE, JSON.stringify(tasks));
    const updatedTasks = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    console.log("Updated tasks (completed):", updatedTasks);
    if (!updatedTasks[0].completed) {
        throw new Error("Complete task failed!");
    }

    // 4. Delete a task
    writeFileSync(DATA_FILE, JSON.stringify([]));
    const remainingTasks = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    console.log("Remaining tasks (after delete):", remainingTasks);
    if (remainingTasks.length !== 0) {
        throw new Error("Delete task failed!");
    }

    console.log("Smoke test passed!");
    clearTasks(); // Clean up after test
}

runSmokeTest();