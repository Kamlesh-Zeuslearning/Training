import RowHeaderEvents from "../events/RowHeaderEvents.js";

/**
 * Represents the row header of the spreadsheet.
 * Responsible for drawing row numbers and horizontal grid lines.
 */
class RowHeader {
    /**
     * @param {Spreadsheet} spreadsheet - The parent spreadsheet instance.
     */
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasHeight =
            this.config.cellHeight * this.config.visibleRows + 300;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById("rowHeader").appendChild(this.canvas);

        this.events = new RowHeaderEvents(this);
    }

    /**
     * Creates and configures the row header canvas.
     * Sets device pixel ratio for high-DPI displays.
     * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} The canvas and its 2D rendering context.
     */
    createCanvas() {
        const canvas = document.createElement("canvas");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = this.config.rowWidth * dpr;

        canvas.height = this.canvasHeight * dpr;

        canvas.style.width = `${this.config.rowWidth}px`;
        canvas.style.height = `${this.canvasHeight}px`;
        canvas.style.position = "absolute";

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        return { canvas, ctx };
    }

    /**
     * Draws the row numbers and horizontal lines on the row header.
     * @param {number} startRow - The index of the first visible row.
     */
    draw() {
        const startRow = this.spreadsheet.currentStartRow;
        const { cellHeight, visibleRows } = this.config;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.config.rowWidth, this.canvasHeight);
        ctx.beginPath();

        //styles for text
        ctx.font = "12px Arial";
        ctx.textAlign = "end";
        ctx.textBaseline = "middle";

        let rowSum = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            const rowHeight =
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            rowSum += rowHeight;
            const rowY = rowSum - rowHeight / 2;

            //if cell is selected
            if (this.spreadsheet.isSelectingRange) {
                let selectedRange =
                    this.spreadsheet.selectionManager.getSelectedRange();
                if (
                    selectedRange.startRow <= rowIndex &&
                    selectedRange.endRow >= rowIndex
                ) {
                    ctx.fillStyle = " #CAEAD8"; // highlight color
                    ctx.fillRect(
                        0,
                        rowSum - rowHeight,
                        this.config.rowWidth - 0.5,
                        rowHeight - 0.5
                    );
                    ctx.fillStyle = " #107C41";
                    ctx.fillRect(
                        this.config.rowWidth - 3,
                        rowSum - rowHeight - 0.5,
                        2,
                        rowHeight
                    );
                }
            }

            //if col is selected
            if (this.spreadsheet.selectedColumn !== null) {
                ctx.fillStyle = " #CAEAD8"; // highlight color
                ctx.fillRect(
                    0,
                    rowSum - rowHeight,
                    this.config.rowWidth - 0.5,
                    rowHeight - 0.5
                );
            }

            //if this row is selected,  highlight it
            if (
                this.spreadsheet.selectedRow !== null &&
                this.spreadsheet.selectionManager.getSelectedRange().startRow <=
                    rowIndex &&
                this.spreadsheet.selectionManager.getSelectedRange().endRow >=
                    rowIndex
            ) {
                ctx.fillStyle = " #107C41"; // highlight color
                ctx.fillRect(
                    0,
                    rowSum - rowHeight,
                    this.config.rowWidth - 0.5,
                    rowHeight - 0.5
                );

                ctx.font = "bold 14px Segoe UI, sans-serif";
                ctx.fillStyle = "#FFF"; // Text color on highlight
            } else {
                ctx.font = "14px Arial";
                ctx.fillStyle = " #000"; // Regular text color
            }
            if (this.spreadsheet.selectedColumn !== null) {
                ctx.fillStyle = " #195f3a";
            }
            ctx.fillText(rowIndex + 1, this.config.rowWidth - 5, rowY);
        }

        if (this.spreadsheet.selectedColumn !== null) {
            ctx.strokeStyle = " #9BC3AE";
        } else {
            ctx.strokeStyle = "#ccc";
        }

        rowSum = 0;
        //drawing horizontal lines
        for (let r = 0; r < visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            ctx.moveTo(0, rowSum - 0.5);
            ctx.lineTo(this.config.rowWidth, rowSum - 0.5);
        }

        //drawing right border for rowHeader
        ctx.moveTo(this.config.rowWidth - 0.5, 0);
        ctx.lineTo(this.config.rowWidth - 0.5, this.canvasHeight);
        ctx.stroke();
    }

    /**
     * Sets the position of the row header canvas on the screen.
     * @param {number} top - The top offset in pixels.
     * @param {number} left - The left offset in pixels.
     */
    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}

export default RowHeader;
