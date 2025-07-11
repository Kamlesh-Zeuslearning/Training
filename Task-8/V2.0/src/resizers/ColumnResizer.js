import ResizeColumnCommand from "../commands/ResizeColumnCommand.js";
import AddColumnCommand from "../commands/AddColumnCommand.js";

/**
 * Handles column resizing and adding via mouse interaction in the column header.
 */
export default class ColumnResizer {
    /**
     * @param {Spreadsheet} spreadsheet - The main spreadsheet instance.
     */
    constructor(spreadsheet) {
        /** @type {Spreadsheet} */
        this.spreadsheet = spreadsheet;

        /** @type {boolean} */
        this.resize = false;

        /** @type {boolean} */
        this.addCol = false;

        /** @type {number|null} */
        this.colIndex = null;

        /** @type {number} */
        this.startX = 0;

        /** @type {number} */
        this.startColWidth = 0;

        /** @type {number} */
        this.threshold = 5; // pixel distance to detect edge for resizing

        this.addEventListeners();
    }

    /**
     * Adds mouse event listeners to handle resizing or adding columns.
     */
    addEventListeners() {
        const colHeaderCanvas = this.spreadsheet.colHeader.canvas;

        colHeaderCanvas.addEventListener("pointermove", (e) =>
            this.onMouseMove(e)
        );
        colHeaderCanvas.addEventListener("pointerdown", (e) =>
            this.onMouseDown(e)
        );
        window.addEventListener("pointerup", () => this.onMouseUp());
        window.addEventListener("pointermove", (e) => this.onMouseResize(e));
    }

    /**
     * Handles mouse movement over the column header to detect if resizing or adding should occur.
     * @param {MouseEvent} e - The mouse move event.
     */
    onMouseMove(e) {
        if (this.resize) return;

        const rect = this.spreadsheet.colHeader.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        let widthSum = 0;
        this.colIndex = null;

        for (let c = 0; c < this.spreadsheet.config.visibleCols; c++) {
            widthSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            if (Math.abs(mouseX - widthSum) < this.threshold) {
                this.colIndex = this.spreadsheet.currentStartCol + c;
                break;
            }
        }

        this.spreadsheet.colHeader.canvas.style.cursor =
            this.colIndex === null ? "default" : "col-resize";

        if (this.colIndex !== null) {
            if (e.clientY <= 60) {
                this.addCol = true;
                this.spreadsheet.isColumnAdder = true;
                this.spreadsheet.colHeader.canvas.style.cursor = "cell";
            } else {
                this.addCol = false;
                this.spreadsheet.isColumnAdder = false;

                this.spreadsheet.colHeader.canvas.style.cursor = "col-resize";
            }
        } else {
            this.spreadsheet.isColumnAdder = false;
        }
    }

    /**
     * Handles mouse down event to begin resizing or to add a new column.
     * @param {MouseEvent} e - The mouse down event.
     */
    onMouseDown(e) {
        if (this.colIndex === null) return;

        if (this.addCol) {
            const cmd = new AddColumnCommand(
                this.spreadsheet,
                this.colIndex + 1
            );
            this.spreadsheet.commandManager.executeCommand(cmd);

            return;
        }

        this.resize = true;
        this.spreadsheet.isColResizeIntent = true;
        this.startX = e.clientX;
        this.startColWidth = this.spreadsheet.colWidths[this.colIndex];
    }

    /**
     * Handles mouse up event to finalize a column resize operation.
     */
    onMouseUp() {
        if (this.resize) {
            this.resize = false;

            const finalWidth = this.spreadsheet.colWidths[this.colIndex];
            if (finalWidth !== this.startColWidth) {
                const cmd = new ResizeColumnCommand(
                    this.spreadsheet,
                    this.colIndex,
                    this.startColWidth,
                    finalWidth
                );
                this.spreadsheet.commandManager.executeCommand(cmd);
            }
            this.colIndex = null;
        }
        this.spreadsheet.isColResizeIntent = false;
    }

    /**
     * Handles live resizing of a column while the mouse is dragged.
     * @param {MouseEvent} e - The mouse move event.
     */
    onMouseResize(e) {
        if (!this.resize) return;

        window.requestAnimationFrame(() => {
            const delta = e.clientX - this.startX;
            const newWidth = this.startColWidth + delta;

            if (newWidth > 20) {
                this.spreadsheet.colWidths[this.colIndex] = newWidth;
                this.spreadsheet.render();
            }
        });
    }
}
