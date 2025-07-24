import EditCellCommand from "../commands/EditCellCommand.js";

/**
 * Manages cell editing in the spreadsheet UI.
 * Handles rendering the input field, committing edits, and navigating between cells.
 */
class CellEditor {
    /**
     * @param {Spreadsheet} spreadsheet - Reference to the main spreadsheet instance.
     */
    constructor(spreadsheet) {
        /**
         * Reference to the spreadsheet instance.
         * @type {Spreadsheet}
         */
        this.spreadsheet = spreadsheet;

        /**
         * HTML input field used for editing cells.
         * @type {HTMLInputElement}
         */
        this.inputField = document.getElementById("input");

        /**
         * Currently edited cell position.
         * @type {{row: number, col: number}|null}
         */
        this.currentCell = null;

        this.initListeners();
    }

    /**
     * Initializes keyboard event listeners on the input field.
     * Handles Escape, Enter, and Arrow keys for editing and navigation.
     */
    initListeners() {
        this.spreadsheet.grid.canvas.addEventListener("dblclick", () => {
            this.inputField.style.visibility = "visible";
            this.inputField.focus();
        });
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey) return;
            if (e.key === "Escape") {
                if (document.activeElement === this.inputField) {
                    this.inputField.blur();
                } else {
                    this.inputField.style.visibility = "hidden";
                    this.spreadsheet.selectionManager.startCell = null;
                    this.spreadsheet.selectionManager.endCell = null;

                    this.hideInput();
                }
            } else if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Enter"
            ) {
                e.preventDefault();
                const cell = this.spreadsheet.selectedCell;
                if (cell === null) return;

                if (e.key === "ArrowDown") {
                    cell.row++;
                } else if (e.key === "ArrowUp" && cell.row > 0) {
                    cell.row--;
                } else if (e.key === "ArrowRight") {
                    cell.col++;
                } else if (e.key === "ArrowLeft" && cell.col > 0) {
                    cell.col--;
                } else if (e.key === "Enter") {
                    if (!e.shiftKey) {
                        cell.row++;
                    } else if (cell.row > 0) {
                        cell.row--;
                    }
                }

                this.spreadsheet.selectionManager.startCell = {
                    row: cell.row,
                    col: cell.col,
                };
                this.spreadsheet.selectionManager.endCell = {
                    row: cell.row,
                    col: cell.col,
                };
                this.showEditor(cell.row, cell.col);
            } else {
                this.inputField.style.visibility = "visible";
                this.inputField.focus();
            }
        });
    }

    /**
     * Displays the input field over the given cell and populates its value if available.
     *
     * @param {number} row - The row index of the cell to edit.
     * @param {number} col - The column index of the cell to edit.
     */
    showEditor(row, col) {
        this.commitInput();

        const config = this.spreadsheet.config;
        const rowHeights = this.spreadsheet.rowHeights;
        const colWidths = this.spreadsheet.colWidths;

        const rowSum = this.spreadsheet.sumHeight(0, row);
        const colSum = this.spreadsheet.sumWidths(0, col);

        const top = rowSum + config.colHeight + config.topPadding;
        const left = colSum + config.rowWidth;

        this.inputField.style.top = `${top + 2}px`;
        this.inputField.style.left = `${left + 2}px`;
        this.inputField.style.height = `${rowHeights[row] - 4}px`;
        this.inputField.style.width = `${colWidths[col] - 4}px`;

        if (this.spreadsheet.gridData.hasData(row, col)) {
            this.inputField.value = this.spreadsheet.gridData.getCellValue(
                row,
                col
            );
        } else {
            this.inputField.value = "";
        }
        this.inputField.style.display = "block";
        this.inputField.style.visibility = "hidden";
        this.currentCell = { row, col };

        this.spreadsheet.render();
    }

    /**
     * Commits the current value from the input field to the data model using a command.
     * Clears the input field after committing.
     */
    commitInput() {
        if (this.currentCell == null) return;
        const { row, col } = this.currentCell;

        const value = this.inputField.value;
        const oldValue = this.spreadsheet.gridData.getCellValue(row, col);

        if ((value === "" && oldValue === null) || oldValue == value) {
            // No change
            return;
        }
        const cmd = new EditCellCommand(this.spreadsheet, row, col, value);
        this.spreadsheet.commandManager.executeCommand(cmd);
    }

    /**
     * Hides the input field and resets cell selection state.
     */
    hideInput() {
        this.inputField.style.display = "none";
        this.currentCell = null;
        this.spreadsheet.selectedCell = null;

        this.spreadsheet.render();
    }
}

export default CellEditor;
