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
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;

        let rowSum = 0;
        for (let r = 0; r < this.config.visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            if (mouseY < rowSum) {
                if (
                    Math.abs(mouseY - rowSum) > 5 &&
                    Math.abs(
                        mouseY -
                            rowSum +
                            this.spreadsheet.rowHeights[
                                this.spreadsheet.currentStartRow + r
                            ]
                    ) > 5
                ) {
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
                }
                break;
            }
        }
    }
}

export default RowHeaderEvents;
