class ResizeRowCommand{
    constructor(spreadsheet, rowindex, oldHeight, newHeight){
        this.spreadsheet = spreadsheet;
        this.rowindex = rowindex;
        this.oldHeight = oldHeight;
        this.newHeight = newHeight;
    }

    execute(){
        this.spreadsheet.rowHeights[this.rowindex] = this.newHeight;
        this._refresh();
    }

    undo(){
        this.spreadsheet.rowHeights[this.rowindex] = this.oldHeight;
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

export default ResizeRowCommand;