// ResizeColumnCommand.js
class ResizeColumnCommand {
    constructor(spreadsheet, colIndex, oldWidth, newWidth) {
        this.spreadsheet = spreadsheet;
        this.colIndex = colIndex;
        this.oldWidth = oldWidth;
        this.newWidth = newWidth;
    }

    execute() {
        this.spreadsheet.colWidths[this.colIndex] = this.newWidth;
        this._refresh();
    }

    undo() {
        this.spreadsheet.colWidths[this.colIndex] = this.oldWidth;
        this._refresh();
    }

    _refresh() {
        this.spreadsheet.updateAfterResize();
        const selected = this.spreadsheet.selectedCell;
        if (selected) {
            this.spreadsheet.cellEditor.showEditor(selected.row, selected.col);
        }
    }
}

export default ResizeColumnCommand;
