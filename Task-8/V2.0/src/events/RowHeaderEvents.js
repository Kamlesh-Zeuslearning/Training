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
