/**
 * Handles row header-related events, including row selection and deselection.
 */
class RowHeaderEvents {
    /**
     * Creates an instance of RowHeaderEvents.
     * @param {RowHeader} rowHeader - The row header instance.
     */
    constructor(rowHeader) {
        /** @type {RowHeader} */
        this.rowHeader = rowHeader;

        /** @type {Spreadsheet} */
        this.spreadsheet = rowHeader.spreadsheet;

        /** @type {HTMLCanvasElement} */
        this.canvas = rowHeader.canvas;

        /** @type {object} */
        this.config = rowHeader.config;
    }

    /**
     * Initializes listeners to clear row selection when clicking outside the row header.
     */
    initRowSelectionDeselect() {
        // Deselect row when clicking on the main grid
        this.spreadsheet.grid.canvas.addEventListener("mousedown", () => {
            if (this.spreadsheet.selectedRow !== null) {
                this.spreadsheet.selectedRow = null;

                this.spreadsheet.grid.draw(
                    this.spreadsheet.currentStartRow,
                    this.spreadsheet.currentStartCol
                );
                this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
                this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
            }
        });

        // Deselect row when clicking on column header (unless resizing a column)
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
                this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
                this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
            }
        });
    }
}

export default RowHeaderEvents;
