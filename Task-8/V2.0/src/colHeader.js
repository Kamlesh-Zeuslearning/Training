import ColHeaderEvents from "./ColHeaderEvents.js";

/**
 * Represents the column header area of the spreadsheet.
 * Handles rendering column labels and selection logic.
 */
class ColHeader {
    /**
     * @param {Spreadsheet} spreadsheet - The parent spreadsheet instance.
     */
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasWidth = this.config.cellWidth * this.config.visibleCols;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById("colHeader").appendChild(this.canvas);

        // Delegate event handling
        this.events = new ColHeaderEvents(this);
    }

    /**
     * Creates and configures the canvas element for the column header.
     * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} The canvas and 2D rendering context.
     */
    createCanvas() {
        const canvas = document.createElement("canvas");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = this.canvasWidth * dpr;
        canvas.height = this.config.cellHeight * dpr;

        canvas.style.width = `${this.canvasWidth}px`;
        canvas.style.height = `${this.config.cellHeight}px`;
        canvas.style.position = "absolute";

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        return { canvas, ctx };
    }

    /**
     * Renders the column headers, grid lines, and column labels.
     * @param {number} startCol - The index of the first visible column.
     */
    draw(startCol) {
        const { cellWidth, visibleCols } = this.config;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasWidth, this.config.cellHeight);
        ctx.beginPath();

        // Style for header text
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let colSum = 0;
        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            const colWidth =
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            colSum += colWidth;
            const colLabel = this.getIndex(colIndex + 1);
            const colX = colSum - colWidth / 2;

            //highlight col when cell is selected
            if (
                this.spreadsheet.selectedCell &&
                this.spreadsheet.selectedCell.col == colIndex
            ) {
                ctx.fillStyle = " #CAEAD8"; // highlight color
                ctx.fillRect(
                    colSum - colWidth,
                    0,
                    colWidth - 0.5,
                    this.config.cellHeight
                );
                ctx.fillStyle = " #107C41";
                ctx.fillRect(
                    colSum - colWidth - 0.5,
                    this.config.cellHeight - 3,
                    colWidth,
                    2
                );
            }

            //if row is selected
            if (this.spreadsheet.selectedRow !== null) {
                ctx.fillStyle = " #CAEAD8"; // highlight color
                ctx.fillRect(
                    colSum - colWidth,
                    0,
                    colWidth - 0.5,
                    this.config.cellHeight
                );
            }

            // If this column is selected, draw highlight first
            if (colIndex === this.spreadsheet.selectedColumn) {
                ctx.fillStyle = " #107C41";
                ctx.fillRect(
                    colSum - colWidth,
                    0,
                    colWidth,
                    this.config.cellHeight
                );

                ctx.font = "bold 14px Segoe UI, sans-serif";
                ctx.fillStyle = " #FFF"; // Text color on highlight
            } else {
                ctx.font = "14px Arial";
                ctx.fillStyle = " #000"; // Regular text color
            }

            //if row is selected higlight text of col to
            if (this.spreadsheet.selectedRow !== null) {
                ctx.fillStyle = " #195f3a";
            }
            ctx.fillText(colLabel, colX, 15);
        }

        //if any row is selected highlight grid of col
        if (this.spreadsheet.selectedRow !== null) {
            ctx.strokeStyle = " #9BC3AE";
        } else {
            ctx.strokeStyle = " #ccc";
        }

        //drawing vertical lines
        colSum = 0;
        for (let c = 0; c < visibleCols; c++) {
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            ctx.moveTo(colSum - 0.5, 0);
            ctx.lineTo(colSum - 0.5, this.config.cellHeight);
        }

        // drawing bottom line
        ctx.moveTo(0, this.config.cellHeight - 0.5);
        ctx.lineTo(this.canvasWidth, this.config.cellHeight - 0.5);
        ctx.stroke();
    }

    /**
     * Sets the canvas position on screen.
     * @param {number} top - The top offset in pixels.
     * @param {number} left - The left offset in pixels.
     */
    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }

    /**
     * Converts a 1-based column index to its corresponding alphabetical label (e.g. 1 -> A, 27 -> AA).
     * @param {number} num - The 1-based column number.
     * @returns {string} Alphabetical label of the column.
     */
    getIndex(num) {
        let result = "";

        while (num > 0) {
            num--; // Decrease by 1 to handle the 1-based index
            result = String.fromCharCode((num % 26) + 65) + result; // Convert to letter and append to result
            num = Math.floor(num / 26); // Divide by 26 to process the next "digit"
        }

        return result;
    }
}

export default ColHeader;
