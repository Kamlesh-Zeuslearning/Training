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
        this.canvasHeight = this.config.cellHeight * this.config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById("rowHeader").appendChild(this.canvas);
        this.initEventListeners();
    }

    /**
     * Creates and configures the row header canvas.
     * Sets device pixel ratio for high-DPI displays.
     * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} The canvas and its 2D rendering context.
     */
    createCanvas() {
        const canvas = document.createElement("canvas");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = this.config.cellWidth * dpr;

        canvas.height = this.canvasHeight * dpr;

        canvas.style.width = `${this.config.cellWidth}px`;
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
    draw(startRow) {
        const { cellHeight, visibleRows } = this.config;
        const ctx = this.ctx;
        // console.log(this.config.cellWidth, "hi")
        ctx.clearRect(0, 0, this.config.cellWidth, this.canvasHeight);
        ctx.beginPath();

        ctx.strokeStyle = "#ccc";
        let rowSum = 0;
        //drawing horizontal lines
        for (let r = 0; r < visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            ctx.moveTo(0, rowSum - 0.5);
            ctx.lineTo(this.config.cellWidth, rowSum - 0.5);
        }

        //drawing right border for rowHeader
        ctx.moveTo(this.config.cellWidth - 0.5, 0);
        ctx.lineTo(this.config.cellWidth - 0.5, this.canvasHeight);
        ctx.stroke();

        //styles for text
        ctx.font = "12px Arial";
        ctx.textAlign = "end";

        rowSum = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            const rowHeight =
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            rowSum += rowHeight;
            const rowY = rowSum - rowHeight / 2;

            //if this row is selected,  highlight it
            if (rowIndex === this.spreadsheet.selectedRow) {
                ctx.fillStyle = "rgba(173, 216, 230, 0.4)";
                ctx.fillRect(
                    0,
                    rowSum - rowHeight,
                    this.config.cellWidth,
                    rowHeight
                );
                ctx.fillStyle = "#FFF"; // Text color on highlight
            } else {
                ctx.fillStyle = "#000"; // Regular text color
            }

            ctx.fillText(rowIndex, this.config.cellWidth - 5, rowY);
        }
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

    /**
     * Sets up event listeners for row selection.
     */
    initEventListeners() {
        this.canvas.addEventListener(
            "mousedown",
            this.handleMouseDown.bind(this)
        );
    }

    /**
     * Handles mouse down events to detect row selection.
     * @param {MouseEvent} e - The mouse event.
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;

        let rowSum = 0;
        for (let r = 0; r < this.config.visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            if (mouseY < rowSum) {
                if (
                    Math.abs(mouseY - rowSum) > 5 &&
                    Math.abs(
                        mouseY -
                            rowSum +
                            this.spreadsheet.rowHeights[
                                this.spreadsheet.currentStartRow + r
                            ]
                    ) > 5
                ) {
                    this.spreadsheet.selectedRow =
                        this.spreadsheet.currentStartRow + r;
                    this.spreadsheet.grid.draw(
                        this.spreadsheet.currentStartRow,
                        this.spreadsheet.currentStartCol
                    );
                    this.draw(this.spreadsheet.currentStartRow);
                }
                break;
            }
        }
    }
}

export default RowHeader;
