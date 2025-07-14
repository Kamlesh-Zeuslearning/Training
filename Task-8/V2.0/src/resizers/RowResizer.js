import ResizeRowCommand from "../commands/ResizeRowCommand.js";
import AddRowCommand from "../commands/AddRowCommand.js";

/**
 * Class for handling row resizing in the spreadsheet.
 * This class manages mouse events and updates row heights during resizing.
 */
export default class RowResizer {
    /**
     * @param {Spreadsheet} spreadsheet - The main Spreadsheet instance.
     */
    constructor(spreadsheet, dispatcher) {
        this.spreadsheet = spreadsheet;

        this.rowIndex = null; // The index of the row being resized
        this.startY = 0; // The initial Y position when resizing starts
        this.startRowHeight = 0; // The initial height of the row
        this.threshold = 5; // The threshold distance (in pixels) for detecting resize handles
        this.addRow = false;

        dispatcher.register({
            hitTest: this.hitTest.bind(this),
            onPointerDown: this.onMouseDown.bind(this),
            onPointerUp: this.onMouseUp.bind(this),
            onPointerMove: this.onMouseResize.bind(this),
        });
    }

    hitTest(e) {
        if (e.target !== this.spreadsheet.rowHeader.canvas) return false;
        this.onMouseMove(e);
        return this.rowIndex !== null;
    }

    /**
     * Handles mouse movement to detect if the mouse is near a row resize handle.
     * Updates the cursor to indicate resizing.
     *
     * @param {MouseEvent} e - The mouse move event
     */
    onMouseMove(e) {
        const rect = this.spreadsheet.rowHeader.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        let rowSum = 0;
        this.rowIndex = null;

        // Check if the mouse is near any row header for resizing
        for (let i = 0; i < this.spreadsheet.config.visibleRows; i++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + i
                ];
            if (Math.abs(rowSum - mouseY) < this.threshold) {
                this.rowIndex = this.spreadsheet.currentStartRow + i;
                break;
            }
        }

        // Update the cursor style based on whether a resize is detected
        this.spreadsheet.rowHeader.canvas.style.cursor =
            this.rowIndex === null ? "default" : "row-resize";

        if (this.rowIndex !== null) {
            if (e.clientX <= 25) {
                this.addRow = true;
                this.spreadsheet.rowHeader.canvas.style.cursor = "cell";
            } else {
                this.addRow = false;
                this.spreadsheet.colHeader.canvas.style.cursor = "col-resize";
            }
        }
    }

    /**
     * Handles mouse down event to start resizing a row.
     *
     * @param {MouseEvent} e - The mouse down event
     */
    onMouseDown(e) {
        if (this.addRow) {
            const cmd = new AddRowCommand(this.spreadsheet, this.rowIndex + 1);
            this.spreadsheet.commandManager.executeCommand(cmd);
            return;
        }

        this.startY = e.clientY; // Store the initial mouse Y position
        this.startRowHeight = this.spreadsheet.rowHeights[this.rowIndex]; // Store the initial row height
    }

    /**
     * Handles mouse up event to stop the row resizing.
     */
    onMouseUp() {
        const finalHeight = this.spreadsheet.rowHeights[this.rowIndex];
        if (finalHeight !== this.startRowHeight) {
            const cmd = new ResizeRowCommand(
                this.spreadsheet,
                this.rowIndex,
                this.startRowHeight,
                finalHeight
            );
            this.spreadsheet.commandManager.executeCommand(cmd); // Execute the resize command
        }
        this.rowIndex = null; // Clear the row index
    }

    /**
     * Handles mouse move event while resizing a row.
     * Updates the row height as the mouse moves.
     *
     * @param {MouseEvent} e - The mouse move event
     */
    onMouseResize(e) {
        window.requestAnimationFrame(() => {
            const delta = e.clientY - this.startY; // Calculate the distance moved by the mouse
            const newHeight = this.startRowHeight + delta; // Calculate new row height

            if (newHeight > 20) {
                // Set a minimum height constraint
                this.spreadsheet.rowHeights[this.rowIndex] = newHeight;
                this.spreadsheet.render(); // Update the view after resizing
            }
        });
    }
}
