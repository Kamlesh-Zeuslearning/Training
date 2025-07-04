class SelectionManager {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.isSelecting = false;
        this.startCell = null;
        this.endCell = null;

        this.attachEvents();
    }

    attachEvents() {
        const canvas = this.spreadsheet.grid.canvas;

        canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        window.addEventListener("mouseup", () => this.handleMouseUp());
    }

    handleMouseDown(e) {
        const cell = this.getCellFromMouseEvent(e);
        if (!cell) return;

        this.startCell = cell;
        this.endCell = cell;
        this.isSelecting = true;
        this.spreadsheet.isSelectingRange = true;
        this.spreadsheet.grid.draw(
            this.spreadsheet.currentStartRow,
            this.spreadsheet.currentStartCol
        ); // force redraw
        this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
        this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
    }

    handleMouseMove(e) {
        if (!this.isSelecting) return;

        const cell = this.getCellFromMouseEvent(e);
        if (!cell) return;

        this.endCell = cell;
        this.spreadsheet.grid.draw(
            this.spreadsheet.currentStartRow,
            this.spreadsheet.currentStartCol
        );
        this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
        this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
    }

    handleMouseUp() {
        if (!this.isSelecting) return;

        this.isSelecting = false;
        // this.spreadsheet.isSelectingRange = false;
    }

    getSelectedRange() {
        if (!this.startCell || !this.endCell) return null;

        const startRow = Math.min(this.startCell.row, this.endCell.row);
        const endRow = Math.max(this.startCell.row, this.endCell.row);
        const startCol = Math.min(this.startCell.col, this.endCell.col);
        const endCol = Math.max(this.startCell.col, this.endCell.col);

        return { startRow, startCol, endRow, endCol };
    }

    getCellFromMouseEvent(e) {
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

        return { row, col };
    }
}

export default SelectionManager;
