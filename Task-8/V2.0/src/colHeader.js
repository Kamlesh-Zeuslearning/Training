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

        this.initEventListeners();
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
        ctx.strokeStyle = "#ccc";

        //drawing vertical lines
        let colSum = 0;
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

        // Style for header text
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        colSum = 0;
        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            const colWidth =
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            colSum += colWidth;
            const colLabel = this.getIndex(colIndex + 1);
            const colX = colSum - colWidth / 2;

            // If this column is selected, draw highlight first
            if (colIndex === this.spreadsheet.selectedCol) {
                ctx.fillStyle = "rgba(173, 216, 230, 0.4)";
                ctx.fillRect(
                    colSum - colWidth,
                    0,
                    colWidth,
                    this.config.cellHeight
                );

                ctx.fillStyle = "#FFF"; // Text color on highlight
            } else {
                ctx.fillStyle = "#000"; // Regular text color
            }

            ctx.fillText(colLabel, colX, 15);
        }
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

    /**
     * Sets up event listeners for column selection.
     */
    initEventListeners() {
        this.canvas.addEventListener(
            "mousedown",
            this.handleMouseDown.bind(this)
        );
    }

    /**
     * Handles mouse down events to detect column selection.
     * @param {MouseEvent} e - The mouse event.
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        let colSum = 0;
        for (let c = 0; c < this.config.visibleCols; c++) {
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            if (mouseX < colSum) {
                if (
                    Math.abs(mouseX - colSum) > 5 &&
                    Math.abs(
                        mouseX -
                            colSum +
                            this.spreadsheet.colWidths[
                                this.spreadsheet.currentStartCol + c
                            ]
                    ) > 5
                ) {
                    this.spreadsheet.selectedCol =
                        this.spreadsheet.currentStartCol + c;
                    this.spreadsheet.grid.draw(
                        this.spreadsheet.currentStartRow,
                        this.spreadsheet.currentStartCol
                    );
                    this.draw(this.spreadsheet.currentStartCol);
                }
                break;
            }
        }
    }
}

export default ColHeader;
