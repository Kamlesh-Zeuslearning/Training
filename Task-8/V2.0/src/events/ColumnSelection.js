class ColumnSelection {
    constructor(spreadsheet, dispatcher) {
        this.spreadsheet = spreadsheet;


        this.autoScrollInterval = null;
        this.autoScrollSpeed = 20; // pixels per scroll step
        this.autoScrollDelay = 50; // ms between scroll steps

        dispatcher.register({
            hitTest: this.hitTest.bind(this),
            onPointerDown: this.handleMouseDown.bind(this),
            onPointerMove: this.handleMouseMove.bind(this),
            onPointerUp: this.handleMouseUp.bind(this),
        });
    }

    hitTest(e) {
        return e.target === this.spreadsheet.colHeader.canvas;
    }

    handleMouseDown(e) {
        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(
            e,
            "colHeader"
        );
        if (!cell) return;

        this.spreadsheet.selectedCell = null;
        this.spreadsheet.selectionManager.startCell = cell;
        this.spreadsheet.selectionManager.endCell = cell;
        
        this.spreadsheet.selectedRow = null;
        this.spreadsheet.selectedColumn = cell.col;

        this.spreadsheet.cellEditor.hideInput();
    }

    handleMouseMove(e) {

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
                            "collHeader"
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
            "collHeader"
        );
        if (cell) {
            this.spreadsheet.selectionManager.endCell = cell;
            this.spreadsheet.render();
        }
    }

    handleMouseUp() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
}

export default ColumnSelection;
