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
         * @type {{row: number, col: number}|undefined}
         */
        this.currentCell = undefined;

        this.initListeners();
    }

    /**
     * Initializes keyboard event listeners on the input field.
     * Handles Escape, Enter, and Arrow keys for editing and navigation.
     */
    initListeners() {
        window.addEventListener("keydown", (e) => {
            if(e.ctrlKey) return;
            if (e.key === "Escape") {
                if (document.activeElement === this.inputField) {
                    this.inputField.blur();
                } else {
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
                if (this.spreadsheet.selectedCell === null) return;
                const cell = this.spreadsheet.selectedCell;

                if (e.key === "ArrowDown") {
                    cell.row++;
                } else if (e.key === "ArrowUp" && cell.row > 0) {
                    cell.row--;
                } else if (e.key === "ArrowRight") {
                    cell.col++;
                } else if (e.key === "ArrowLeft" && cell.col > 0) {
                    cell.col--;
                } else if (e.key === "Enter") {
                    const cell = this.spreadsheet.selectedCell;
                    if (!e.shiftKey) {
                        cell.row++;
                    } else if (cell.row > 0) {
                        cell.row--;
                    }
                }

                this.spreadsheet.selectionManager.startCell = {
                    row: this.spreadsheet.selectedCell.row,
                    col: this.spreadsheet.selectedCell.col,
                };
                this.spreadsheet.selectionManager.endCell = {
                    row: this.spreadsheet.selectedCell.row,
                    col: this.spreadsheet.selectedCell.col,
                };
                this.showEditor(cell.row, cell.col);
            } else {
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

        this.currentCell = { row, col };

        this.spreadsheet.render()
    }

    /**
     * Commits the current value from the input field to the data model using a command.
     * Clears the input field after committing.
     */
    commitInput() {
        this.inputField.blur();
        const value = this.inputField.value;
        const { row, col } = this.currentCell || {};
        if (row == null || col == null) return;

        const saveValue = this.spreadsheet.gridData.getCellValue(row, col);

        if (value === "" && saveValue === null) {
            this.spreadsheet.gridData.clearCell(row, col);
        } else if (saveValue == value) {
            // No change
        } else if (value === "") {
            const cmd = new EditCellCommand(this.spreadsheet, row, col, value);
            this.spreadsheet.commandManager.executeCommand(cmd);
            this.spreadsheet.gridData.clearCell(row, col);
        } else {
            const cmd = new EditCellCommand(this.spreadsheet, row, col, value);
            this.spreadsheet.commandManager.executeCommand(cmd);
        }

        this.inputField.value = "";
    }

    /**
     * Hides the input field and resets cell selection state.
     */
    hideInput() {
        this.inputField.style.display = "none";
        this.inputField.value = "";
        this.currentCell = {};
        this.spreadsheet.selectedCell = null;
        this.spreadsheet.isSelectingRange = false;

        this.spreadsheet.render();
    }
}

export default CellEditor;
