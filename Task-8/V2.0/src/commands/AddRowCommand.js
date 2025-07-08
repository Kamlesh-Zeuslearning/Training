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
    constructor(spreadsheet, rowIndex) {
        this.spreadsheet = spreadsheet;
        this.rowIndex = rowIndex;

        /**
         * The height to assign to the new row. Defaults to 25 if undefined.
         * @type {number}
         */
        this.oldHeight = spreadsheet.rowHeights[rowIndex] || 25;

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
        this.spreadsheet.rowHeights.splice(this.rowIndex, 0, this.oldHeight);
        this.spreadsheet.gridData.insertRow(this.rowIndex);
        this.spreadsheet.updateAfterResize();
    }

    /**
     * Undoes the add row command.
     * Removes the inserted row, captures its data, and restores any overwritten cell values.
     */
    undo() {
        this.spreadsheet.rowHeights.splice(this.rowIndex, 1);
        this.deletedRowData = this.spreadsheet.gridData.deleteRow(this.rowIndex);

        // Restore the cell values from the deleted row
        for (const { row, col, value } of this.deletedRowData) {
            this.spreadsheet.gridData.setCellValue(row, col, value);
        }

        this.spreadsheet.updateAfterResize();
    }
}

export default AddRowCommand;