/**
 * Manages the execution, undo, and redo of commands.
 * Implements the Command pattern.
 */
class CommandManager {
    /**
     * Initializes a new CommandManager with empty undo and redo stacks.
     */
    constructor() {
        /** @type {Array<{execute: Function, undo: Function}>} */
        this.undoStack = [];

        /** @type {Array<{execute: Function, undo: Function}>} */
        this.redoStack = [];
    }

    /**
     * Executes a command and adds it to the undo stack.
     * Clears the redo stack.
     *
     * @param {{execute: Function, undo: Function}} command - The command to execute.
     */
    executeCommand(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }

    /**
     * Undoes the last executed command, if any.
     * Moves the command to the redo stack.
     */
    undo() {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    /**
     * Redoes the last undone command, if any.
     * Moves the command back to the undo stack.
     */
    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
}

export default CommandManager;
