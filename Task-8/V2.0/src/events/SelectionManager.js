class SelectionManager {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;

        this.isSelecting = false;
        this.startCell = null;
        this.endCell = null;

        this.autoScrollInterval = null;
        this.autoScrollSpeed = 20; // pixels per scroll step
        this.autoScrollDelay = 50; // ms between scroll steps

        this.attachEvents(this.spreadsheet.grid.canvas, "grid");
        this.attachEvents(this.spreadsheet.colHeader.canvas, "colHeader");
        this.attachEvents(this.spreadsheet.rowHeader.canvas, "rowHeader");
    }

    attachEvents(canvas, type) {
        canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e, type));

        if (type === "grid") {
            window.addEventListener("mousemove", (e) => this.handleMouseMove(e, type));
        } else {
            canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e, type));
        }

        window.addEventListener("mouseup", () => this.handleMouseUp());
    }

    handleMouseDown(e, type) {
        if (
            this.spreadsheet.isColResizeIntent ||
            this.spreadsheet.isRowResizeIntent ||
            this.spreadsheet.isColumnAdder ||
            this.spreadsheet.isRowAdder
        ) {
            return;
        }

        const cell = this.getCellFromMouseEvent(e, type);
        if (!cell) return;

        this.spreadsheet.isSelectingRange = false;
        this.startCell = cell;
        this.endCell = cell;
        this.isSelecting = true;

        if (type === "grid") {
            this.spreadsheet.isSelectingRange = true;
            this.spreadsheet.selectedCell = { row: cell.row, col: cell.col };
            this.spreadsheet.cellEditor.showEditor(cell.row, cell.col);
        } else if (type === "colHeader") {
            this.spreadsheet.selectedColumn = cell.col;
            this.spreadsheet.cellEditor.hideInput();
        } else if (type === "rowHeader") {
            this.spreadsheet.selectedRow = cell.row;
            this.spreadsheet.cellEditor.hideInput();
        }

    }

    handleMouseMove(e, type) {
        if (!this.isSelecting) return;

        const containerRect = this.spreadsheet.scrollContainer.getBoundingClientRect();
        const threshold = 40;

        let scrollX = 0, scrollY = 0;

        if (e.clientX < containerRect.left + threshold) {
            scrollX = -this.autoScrollSpeed;
        } else if (e.clientX > containerRect.right - threshold) {
            scrollX = this.autoScrollSpeed;
        }

        if (e.clientY < containerRect.top + threshold) {
            scrollY = -this.autoScrollSpeed;
        } else if (e.clientY > containerRect.bottom - threshold) {
            scrollY = this.autoScrollSpeed;
        }

        if (scrollX !== 0 || scrollY !== 0) {
            if (!this.autoScrollInterval) {
                this.autoScrollInterval = setInterval(() => {
                    this.spreadsheet.scrollContainer.scrollBy(scrollX, scrollY);

                    // After scroll, update selection based on latest mouse pos
                    const cell = this.getCellFromMouseEvent(e, type);
                    if (cell) {
                        this.endCell = cell;
                        this.redrawSelection();
                    }
                }, this.autoScrollDelay);
            }
        } else {
            if (this.autoScrollInterval) {
                clearInterval(this.autoScrollInterval);
                this.autoScrollInterval = null;
            }
        }

        // Also update selection normally if mouse inside viewport
        const cell = this.getCellFromMouseEvent(e, type);
        if (cell) {
            this.endCell = cell;
            this.redrawSelection();
        }
    }

    handleMouseUp() {
        if (!this.isSelecting) return;
        this.isSelecting = false;

        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    redrawSelection() {
        this.spreadsheet.grid.draw();
        this.spreadsheet.rowHeader.draw();
        this.spreadsheet.colHeader.draw();
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
