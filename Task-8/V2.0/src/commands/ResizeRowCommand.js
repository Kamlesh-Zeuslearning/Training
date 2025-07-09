/**
 * Command to resize a row in the spreadsheet, supporting undo/redo functionality.
 */
class ResizeRowCommand {
    /**
     * Creates an instance of ResizeRowCommand.
     * 
     * @param {Object} spreadsheet - The spreadsheet object that contains row heights and methods to update the UI.
     * @param {number} rowindex - The index of the row being resized.
     * @param {number} oldHeight - The original height of the row before resizing.
     * @param {number} newHeight - The new height to apply to the row.
     */
    constructor(spreadsheet, rowindex, oldHeight, newHeight) {
        this.spreadsheet = spreadsheet;
        this.rowindex = rowindex;
        this.oldHeight = oldHeight;
        this.newHeight = newHeight;
    }

    /**
     * Executes the row resize command, setting the row to the new height.
     */
    execute() {
        this.spreadsheet.rowHeights[this.rowindex] = this.newHeight;
        this._refresh();
    }

    /**
     * Undoes the row resize command, restoring the original row height.
     */
    undo() {
        this.spreadsheet.rowHeights[this.rowindex] = this.oldHeight;
        this._refresh();
    }

    /**
     * Refreshes the spreadsheet UI after resizing, and re-displays the cell editor if a cell is selected.
     * @private
     */
    _refresh() {
        const selected = this.spreadsheet.selectedCell;
        if (selected) {
            this.spreadsheet.cellEditor.showEditor(selected.row, selected.col);
        }
        else{
            this.spreadsheet.render();
        }
    }
}

export default ResizeRowCommand;