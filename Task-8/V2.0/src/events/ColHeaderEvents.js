/**
 * Handles column header events such as deselection logic when interacting with other spreadsheet areas.
 */
class ColHeaderEvents {
    /**
     * Creates an instance of ColHeaderEvents.
     * @param {ColHeader} colHeader - The column header instance.
     */
    constructor(colHeader) {
        /** @type {ColHeader} */
        this.colHeader = colHeader;

        /** @type {Spreadsheet} */
        this.spreadsheet = colHeader.spreadsheet;

        /** @type {HTMLCanvasElement} */
        this.canvas = colHeader.canvas;
    }


    /**
     * Initializes logic to clear column selection when clicking on grid or row headers.
     */
    initColumnSelectionDeselect() {
        // Deselect column when clicking on row header (unless resizing a row)
        this.spreadsheet.rowHeader.canvas.addEventListener("mousedown", () => {
            if (
                this.spreadsheet.selectedColumn !== null &&
                !this.spreadsheet.isRowResizeIntent
            ) {
                this.spreadsheet.selectedColumn = null;

                this.spreadsheet.grid.draw();
                this.spreadsheet.colHeader.draw();
                this.spreadsheet.rowHeader.draw();
            }
        });

        // Deselect column when clicking on the main grid
        this.spreadsheet.grid.canvas.addEventListener("mousedown", () => {
            if (this.spreadsheet.selectedColumn !== null) {
                this.spreadsheet.selectedColumn = null;

                this.spreadsheet.grid.draw();
                this.spreadsheet.colHeader.draw();
                this.spreadsheet.rowHeader.draw();
            }
        });
    }
}

export default ColHeaderEvents;
