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
        this.inputField.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.spreadsheet.selectionManager.startCell = null;
                this.spreadsheet.selectionManager.endCell = null;
                this.hideInput();
            } else if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                this.commitInput();
                const cell = this.spreadsheet.selectedCell;

                if (e.key === "ArrowDown") {
                    cell.row++;
                } else if (e.key === "ArrowUp" && cell.row > 0) {
                    cell.row--;
                } else if (e.key === "ArrowRight") {
                    cell.col++;
                } else if (e.key === "ArrowLeft" && cell.col > 0) {
                    cell.col--;
                }

                this.showEditor(cell.row, cell.col);
            } else if (e.key === "Enter") {
                this.commitInput();
                const cell = this.spreadsheet.selectedCell;
                if (!e.shiftKey) {
                    cell.row++;
                } else {
                    cell.row--;
                }
                this.showEditor(cell.row, cell.col);
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

        this.spreadsheet.grid.draw();
        this.spreadsheet.colHeader.draw();
        this.spreadsheet.rowHeader.draw();

        setTimeout(() => {
            this.inputField.focus();
        }, 0);
    }

    /**
     * Commits the current value from the input field to the data model using a command.
     * Clears the input field after committing.
     */
    commitInput() {
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

        this.spreadsheet.grid.draw();
        this.spreadsheet.colHeader.draw();
        this.spreadsheet.rowHeader.draw();
    }
}

export default CellEditor;
