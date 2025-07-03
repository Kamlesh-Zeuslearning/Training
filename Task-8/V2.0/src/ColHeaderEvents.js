class ColHeaderEvents {
    /**
     * @param {ColHeader} colHeader - The column header instance.
     */
    constructor(colHeader) {
        this.colHeader = colHeader;
        this.spreadsheet = colHeader.spreadsheet;
        this.canvas = colHeader.canvas;

        this.initEventListeners();
    }

    initEventListeners() {
        this.canvas.addEventListener(
            "mousedown",
            this.handleMouseDown.bind(this)
        );
        this.canvas.addEventListener(
            "mousemove",
            this.handleMouseMove.bind(this)
        );
    }

    handleMouseDown(e) {
        if (this.spreadsheet.isColResizeIntent) {
            return;
        } // 👈 Skip selection if resizing

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        let colSum = 0;
        const { visibleCols } = this.colHeader.config;

        for (let c = 0; c < visibleCols; c++) {
            const colWidth =
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            colSum += colWidth;

            if (mouseX < colSum) {
                this.spreadsheet.selectedColumn =
                    this.spreadsheet.currentStartCol + c;
                this.spreadsheet.selectedCell = null;

                this.spreadsheet.cellEditor.hideInput();

                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.colHeader.draw(this.spreadsheet.currentStartCol);
                this.spreadsheet.rowHeader.draw(
                    this.spreadsheet.currentStartRow
                );

                break;
            }
        }
    }

    handleMouseMove(e) {
        // Optional future implementation
    }

    initColumnSelectionDeselect() {
        // Clicking on row header or grid clears the selected column
        this.spreadsheet.rowHeader.canvas.addEventListener("mousedown", () => {
            if (
                this.spreadsheet.selectedColumn !== null &&
                !this.spreadsheet.isRowResizeIntent
            ) {
                this.spreadsheet.selectedColumn = null;
                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.colHeader.draw(
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.rowHeader.draw(
                    this.spreadsheet.currentStartRow
                );
            }
        });

        this.spreadsheet.grid.canvas.addEventListener("mousedown", () => {
            if (this.spreadsheet.selectedColumn !== null) {
                this.spreadsheet.selectedColumn = null;
                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.colHeader.draw(
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.rowHeader.draw(
                    this.spreadsheet.currentStartRow
                );
            }
        });
    }
}

export default ColHeaderEvents;
