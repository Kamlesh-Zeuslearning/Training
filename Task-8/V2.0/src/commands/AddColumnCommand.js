/**
 * Command to add a new column to the spreadsheet at a specific index,
 * with undo support to remove the column and restore its previous content.
 */
class AddColumnCommand {
    /**
     * Creates an instance of AddColumnCommand.
     * 
     * @param {Object} spreadsheet - The spreadsheet object that manages grid data and column widths.
     * @param {number} colIndex - The index at which to insert the new column.
     */
    constructor(spreadsheet, colIndex) {
        this.spreadsheet = spreadsheet;
        this.colIndex = colIndex;

        /**
         * Stores any cell data removed when the column is deleted (for undo).
         * Format: Array of objects { row, col, value }
         * @type {Array<Object>}
         */
        this.deletedColumnData = [];

        /**
         * The width to assign to the new column. Defaults to 100 if undefined.
         * @type {number}
         */
        this.oldWidth = spreadsheet.colWidths[colIndex] || 100;
    }

    /**
     * Executes the add column command.
     * Inserts a column at the specified index, sets a default width,
     * and triggers a UI update.
     */
    execute() {
        this.spreadsheet.colWidths.splice(this.colIndex, 0, this.oldWidth);
        this.spreadsheet.gridData.insertColumn(this.colIndex);
        this.spreadsheet.render();
    }

    /**
     * Undoes the add column command.
     * Removes the inserted column, captures its data, and restores any overwritten cell values.
     */
    undo() {
        this.spreadsheet.colWidths.splice(this.colIndex, 1);
        this.deletedColumnData = this.spreadsheet.gridData.deleteColumn(this.colIndex);

        // Restore the cell values from the deleted column
        for (const { row, col, value } of this.deletedColumnData) {
            this.spreadsheet.gridData.setCellValue(row, col, value);
        }

        this.spreadsheet.render();
    }
}

export default AddColumnCommand;
