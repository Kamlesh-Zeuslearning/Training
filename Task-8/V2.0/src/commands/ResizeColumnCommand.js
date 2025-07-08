/**
 * Command to resize a column in the spreadsheet, supporting undo/redo functionality.
 */
class ResizeColumnCommand {
    /**
     * Creates an instance of ResizeColumnCommand.
     * 
     * @param {Object} spreadsheet - The spreadsheet object that contains column widths and methods to update UI.
     * @param {number} colIndex - The index of the column being resized.
     * @param {number} oldWidth - The original width of the column before resizing.
     * @param {number} newWidth - The new width to apply to the column.
     */
    constructor(spreadsheet, colIndex, oldWidth, newWidth) {
        this.spreadsheet = spreadsheet;
        this.colIndex = colIndex;
        this.oldWidth = oldWidth;
        this.newWidth = newWidth;
    }

    /**
     * Executes the column resize command, setting the column to the new width.
     */
    execute() {
        this.spreadsheet.colWidths[this.colIndex] = this.newWidth;
        this._refresh();
    }

    /**
     * Undoes the column resize command, restoring the original column width.
     */
    undo() {
        this.spreadsheet.colWidths[this.colIndex] = this.oldWidth;
        this._refresh();
    }

    /**
     * Refreshes the spreadsheet UI after resizing, and re-displays the cell editor if a cell is selected.
     * @private
     */
    _refresh() {
        this.spreadsheet.updateAfterResize();
        const selected = this.spreadsheet.selectedCell;
        if (selected) {
            this.spreadsheet.cellEditor.showEditor(selected.row, selected.col);
        }
    }
}

export default ResizeColumnCommand;
