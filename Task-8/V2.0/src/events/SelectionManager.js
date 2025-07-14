class SelectionManager {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;

        this.isSelecting = false;
        this.startCell = null;
        this.endCell = null;

        this.autoScrollInterval = null;
        this.autoScrollSpeed = 20; // pixels per scroll step
        this.autoScrollDelay = 50; // ms between scroll steps

    }

    getSelectedRange() {
        if (!this.startCell || !this.endCell) return null;

        const startRow = Math.min(this.startCell.row, this.endCell.row);
        const endRow = Math.max(this.startCell.row, this.endCell.row);
        const startCol = Math.min(this.startCell.col, this.endCell.col);
        const endCol = Math.max(this.startCell.col, this.endCell.col);

        return { startRow, startCol, endRow, endCol };
    }

    getCellFromMouseEvent(e, type) {
        const rect = this.spreadsheet.grid.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let rowSum = 0;
        const startRow = this.spreadsheet.currentStartRow;
        let row = null;
        for (let r = 0; r < this.spreadsheet.config.visibleRows; r++) {
            const h = this.spreadsheet.rowHeights[startRow + r];
            if (rowSum + h > y) {
                row = startRow + r;
                break;
            }
            rowSum += h;
        }

        let colSum = 0;
        const startCol = this.spreadsheet.currentStartCol;
        let col = null;
        for (let c = 0; c < this.spreadsheet.config.visibleCols; c++) {
            const w = this.spreadsheet.colWidths[startCol + c];
            if (colSum + w > x) {
                col = startCol + c;
                break;
            }
            colSum += w;
        }

        if (row === null || col === null) return null;

        if (type === "colHeader") {
            row = -1;
        } else if (type === "rowHeader") {
            col = -1;
        }

        return { row, col };
    }
}

export default SelectionManager;
