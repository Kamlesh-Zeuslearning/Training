/**
 * Command for editing a cell in a spreadsheet.
 * Stores both the new and old values for undo/redo functionality.
 */
class EditCellCommand {
    /**
     * Creates an instance of EditCellCommand.
     *
     * @param {Object} options
     * @param {Object} options.gridData - The grid data instance with cell access methods.
     * @param {Function} options.render - Function to trigger a canvas/grid re-render.
     * @param {number} options.row - The row index of the cell to edit.
     * @param {number} options.col - The column index of the cell to edit.
     * @param {string} options.newValue - The new value to assign to the cell.
     */
    constructor({ gridData, render, row, col, newValue }) {
        /** @type {Object} */
        this.gridData = gridData;

        /** @type {number} */
        this.row = row;

        /** @type {Object} */
        this.render = render;

        /** @type {number} */
        this.col = col;

        /** @type {string} */
        this.newValue = newValue;

        /** @type {string|null} */
        this.oldValue = gridData.getCellValue(row, col);
    }

    /**
     * Executes the cell edit by applying the new value
     * and triggering a grid refresh.
     */
    execute() {
        this._setValue(this.newValue);
        this.render();
    }

    /**
     * Undoes the cell edit by restoring the old value
     * or clearing the cell if the original value was empty.
     */
    undo() {
        this._setValue(this.oldValue);
        this.render();
    }

    /**
     * Sets a value to the specified cell or clears it if value is null/empty.
     *
     * @private
     * @param {string|null} value - The value to set in the cell.
     */
    _setValue(value) {
        if (value === null || value === "") {
            this.gridData.clearCell(this.row, this.col);
        } else {
            this.gridData.setCellValue(this.row, this.col, value);
        }
    }
}

export default EditCellCommand;
