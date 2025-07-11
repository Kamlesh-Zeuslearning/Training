class RowSelection {
    constructor(rowHeader) {
        this.spreadsheet = rowHeader.spreadsheet;
        this.isSelecting = false;

        this.autoScrollInterval = null;
        this.autoScrollSpeed = 20; // pixels per scroll step
        this.autoScrollDelay = 50; // ms between scroll steps
    }

    attachEvents(canvas) {
        window.addEventListener("pointerdown", (e) => this.handleMouseDown(e));
        canvas.addEventListener("pointermove", (e) => this.handleMouseMove(e));
        window.addEventListener("pointerup", () => this.handleMouseUp());
    }

    handleMouseDown(e) {
        if (e.clientX > 50) return;
        if (this.spreadsheet.isRowResizeIntent || this.spreadsheet.isRowAdder) {
            return;
        }

        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(
            e,
            "rowHeader"
        );
        if (!cell) return;

        this.spreadsheet.selectedCell = null;
        this.spreadsheet.selectionManager.startCell = cell;
        this.spreadsheet.selectionManager.endCell = cell;
        this.isSelecting = true;

        this.spreadsheet.selectedColumn = null;
        this.spreadsheet.selectedRow = cell.row;
        this.spreadsheet.cellEditor.hideInput();
    }

    handleMouseMove(e) {
        if (!this.isSelecting) return;

        const containerRect =
            this.spreadsheet.scrollContainer.getBoundingClientRect();
        const threshold = 40;

        let scrollX = 0,
            scrollY = 0;

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
                    const cell =
                        this.spreadsheet.selectionManager.getCellFromMouseEvent(
                            e,
                            "rowHeader"
                        );
                    if (cell) {
                        this.spreadsheet.selectionManager.endCell = cell;
                        this.spreadsheet.render();
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
        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(
            e,
            "rowHeader"
        );
        if (cell) {
            this.spreadsheet.selectionManager.endCell = cell;
            this.spreadsheet.render();
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
}

export default RowSelection;
