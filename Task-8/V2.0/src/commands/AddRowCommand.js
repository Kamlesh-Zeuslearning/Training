/**
 * Command to add a new row to the spreadsheet at a specific index,
 * with undo support to remove the row and restore its previous content.
 */
class AddRowCommand {
    /**
     * Creates an instance of AddRowCommand.
     *
     * @param {Object} spreadsheet - The spreadsheet object that manages grid data and row heights.
     * @param {number} rowIndex - The index at which to insert the new row.
     */
    constructor({ rowHeights, gridData, render }, rowIndex) {
        this.rowHeights = rowHeights;
        this.gridData = gridData;
        this.render = render;

        this.rowIndex = rowIndex;

        /**
         * The height to assign to the new row. Defaults to 25 if undefined.
         * @type {number}
         */
        this.oldHeight = rowHeights[rowIndex] || 25;

        /**
         * Stores the data from the deleted row during undo for restoration.
         * Format: Array of objects { row, col, value }
         * @type {Array<Object>}
         */
        this.deletedRowData = [];
    }

    /**
     * Executes the add row command.
     * Inserts a row at the specified index, assigns a default height,
     * and triggers a UI update.
     */
    execute() {
        this.rowHeights.splice(this.rowIndex, 0, this.oldHeight);
        this.gridData.insertRow(this.rowIndex);
        this.render();
    }

    /**
     * Undoes the add row command.
     * Removes the inserted row, captures its data, and restores any overwritten cell values.
     */
    undo() {
        this.rowHeights.splice(this.rowIndex, 1);
        this.deletedRowData = this.gridData.deleteRow(this.rowIndex);

        // Restore the cell values from the deleted row
        for (const { row, col, value } of this.deletedRowData) {
            this.gridData.setCellValue(row, col, value);
        }

        this.render();
    }
}

export default AddRowCommand;
