class RowHeaderEvents {
    /**
     *
     * @param {RowHeader} rowHeader - The row` header instance.
     */
    constructor(rowHeader) {
        this.rowHeader = rowHeader;
        this.spreadsheet = rowHeader.spreadsheet;
        this.canvas = rowHeader.canvas;
        this.config = rowHeader.config;

        this.initEventListeners();
    }

    /**
     * Sets up event listeners for row selection.
     */
    initEventListeners() {
        this.canvas.addEventListener(
            "mousedown",
            this.handleMouseDown.bind(this)
        );
    }

    /**
     * Handles mouse down events to detect row selection.
     * @param {MouseEvent} e - The mouse event.
     */
    handleMouseDown(e) {
        if (this.spreadsheet.isRowResizeIntent) {
            return; // Skip selection if user intends to resize
        }
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;

        let rowSum = 0;
        for (let r = 0; r < this.config.visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            if (mouseY < rowSum) {
                this.spreadsheet.selectedRow =
                    this.spreadsheet.currentStartRow + r;
                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.selectedCell = null;
                this.spreadsheet.cellEditor.hideInput();
                this.rowHeader.draw(this.spreadsheet.currentStartRow);
                this.spreadsheet.colHeader.draw(
                    this.spreadsheet.currentStartCol
                );

                break;
            }
        }
    }

    initRowSelectionDeselect() {
        this.spreadsheet.grid.canvas.addEventListener("mousedown", () => {
            if (this.spreadsheet.selectedRow !== null) {
                this.spreadsheet.selectedRow = null;
                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.rowHeader.draw(
                    this.spreadsheet.currentStartRow
                );
                this.spreadsheet.colHeader.draw(
                    this.spreadsheet.currentStartCol
                );
            }
        });

        this.spreadsheet.colHeader.canvas.addEventListener("mousedown", () => {
            if (
                this.spreadsheet.selectedRow !== null &&
                !this.spreadsheet.isColResizeIntent
            ) {
                this.spreadsheet.selectedRow = null;
                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.rowHeader.draw(
                    this.spreadsheet.currentStartRow
                );
                this.spreadsheet.colHeader.draw(
                    this.spreadsheet.currentStartCol
                );
            }
        });
    }
}

export default RowHeaderEvents;
