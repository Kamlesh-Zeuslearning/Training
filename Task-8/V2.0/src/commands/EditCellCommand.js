/**
 * Command for editing a cell in a spreadsheet.
 * Stores both the new and old values for undo/redo functionality.
 */
class EditCellCommand {
    /**
     * Creates an instance of EditCellCommand.
     *
     * @param {Object} spreadsheet - The spreadsheet instance containing gridData and rendering methods.
     * @param {number} row - The row index of the cell to edit.
     * @param {number} col - The column index of the cell to edit.
     * @param {*} newValue - The new value to set in the cell.
     */
    constructor(spreadsheet, row, col, newValue) {
        /** @type {Object} */
        this.spreadsheet = spreadsheet;

        /** @type {number} */
        this.row = row;

        /** @type {number} */
        this.col = col;

        /** @type {*} */
        this.newValue = newValue;

        /** @type {*} */
        this.oldValue = spreadsheet.gridData.getCellValue(row, col);
    }

    /**
     * Executes the cell edit by applying the new value
     * and triggering a grid refresh.
     */
    execute() {
        this.spreadsheet.gridData.setCellValue(this.row, this.col, this.newValue);
        this._refreshGrid();
    }

    /**
     * Undoes the cell edit by restoring the old value
     * or clearing the cell if the original value was empty.
     */
    undo() {
        if (this.oldValue === null || this.oldValue === "") {
            this.spreadsheet.gridData.clearCell(this.row, this.col);
        } else {
            this.spreadsheet.gridData.setCellValue(this.row, this.col, this.oldValue);
        }
        this._refreshGrid();
    }

    /**
     * Refreshes the spreadsheet grid and headers to reflect changes.
     * Called after execute and undo operations.
     * @private
     */
    _refreshGrid() {
        this.spreadsheet.grid.draw(this.spreadsheet.currentStartRow, this.spreadsheet.currentStartCol);
        this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
        this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
    }
}

export default EditCellCommand;