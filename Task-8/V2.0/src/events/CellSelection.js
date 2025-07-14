class CellSelection {
    constructor(spreadsheet, dispatcher) {
        this.spreadsheet = spreadsheet;

        this.autoScrollSpeed = 10; // pixels per scroll step
        this.isAutoScrolling = false;
        this.scrollX = 0;
        this.scrollY = 0;
        this.mousePosition = { clientX: 0, clientY: 0 };

        dispatcher.register({
            hitTest: this.hitTest.bind(this),
            onPointerDown: this.handleMouseDown.bind(this),
            onPointerMove: this.handleMouseMove.bind(this),
            onPointerUp: this.handleMouseUp.bind(this),
        });
    }

    hitTest(e) {
        return e.target === this.spreadsheet.grid.canvas;
    }

    handleMouseDown(e) {
        this.spreadsheet.selectedRow = null;
        this.spreadsheet.selectedColumn = null;

        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(
            e,
            "grid"
        );
        this.spreadsheet.selectionManager.startCell = cell;
        this.spreadsheet.selectionManager.endCell = cell;

        this.spreadsheet.selectedCell = { row: cell.row, col: cell.col };
        this.spreadsheet.cellEditor.showEditor(cell.row, cell.col);
    }

    handleMouseMove(e) {
        const {domManager, selectionManager } = this.spreadsheet;
        const containerRect = domManager.getScrollContainer().getBoundingClientRect();
        const threshold = 40;

        this.mousePosition = { clientX: e.clientX, clientY: e.clientY };

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

        // Update the scroll velocities
        this.scrollX = scrollX;
        this.scrollY = scrollY;

        if ((scrollX !== 0 || scrollY !== 0) && !this.isAutoScrolling) {
            this.isAutoScrolling = true;
            this.autoScrollLoop();
        } else if (scrollX === 0 && scrollY === 0) {
            this.isAutoScrolling = false; // this will stop the loop next frame
        }

        // After scroll, update selection based on latest mouse pos
        const cell = selectionManager.getCellFromMouseEvent(e, "grid");
        if (
            cell &&
            (selectionManager.endCell.col !== cell.col ||
                selectionManager.endCell.row !== cell.row)
        ) {
            selectionManager.endCell = cell;
            this.spreadsheet.render();
        }
    }

    autoScrollLoop = () => {
        if (!this.isAutoScrolling) return;

        const { domManager, selectionManager } = this.spreadsheet;
        const { scrollX, scrollY, mousePosition } = this;

        domManager.getScrollContainer().scrollBy(scrollX, scrollY);

        const cell = selectionManager.getCellFromMouseEvent(
            mousePosition,
            "grid"
        );
        if (
            cell &&
            (selectionManager.endCell.col !== cell.col ||
                selectionManager.endCell.row !== cell.row)
        ) {
            selectionManager.endCell = cell;
            this.spreadsheet.render();
        }

        requestAnimationFrame(this.autoScrollLoop);
    };

    handleMouseUp() {
        this.isAutoScrolling = false;
    }
}

export default CellSelection;
