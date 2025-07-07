class ColHeaderEvents {
    /**
     * @param {ColHeader} colHeader - The column header instance.
     */
    constructor(colHeader) {
        this.colHeader = colHeader;
        this.spreadsheet = colHeader.spreadsheet;
        this.canvas = colHeader.canvas;
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
