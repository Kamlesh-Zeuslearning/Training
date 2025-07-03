/**
 * GridCanvas is the main canvas for rendering the spreadsheet cells and grid lines.
 */
class GridCanvas {
    /**
     * Creates an instance of GridCanvas.
     * @param {Spreadsheet} spreadsheet - The parent spreadsheet instance.
     */
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasWidth = this.config.cellWidth * this.config.visibleCols;
        this.canvasHeight = this.config.cellHeight * this.config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        // Adding event listeners for selection
        this.addSelectionEventListeners();

        document.getElementById("container").appendChild(this.canvas); //add canvas to the html tree
    }

    /**
     * Creates and configures the canvas element.
     * Sets up device pixel ratio (DPR) for sharp rendering.
     * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} The canvas and its 2D rendering context.
     */
    createCanvas() {
        const canvas = document.createElement("canvas");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = this.canvasWidth * dpr;
        canvas.height = this.canvasHeight * dpr;

        canvas.style.width = `${this.canvasWidth}px`;
        canvas.style.height = `${this.canvasHeight}px`;

        canvas.style.position = "absolute";

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        return { canvas, ctx };
    }

    /**
     * Draws the grid, cell content, and highlights selected columns.
     * @param {number} startRow - Index of the first row to render.
     * @param {number} startCol - Index of the first column to render.
     */
    draw(startRow, startCol) {
        const { cellWidth, cellHeight, visibleRows, visibleCols, totalCols } =
            this.config;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.beginPath();

        // Highlight selected column and row
        this.highlightSelectedColumn(startCol);
        this.highlightSelectedRow(startRow);

        ctx.strokeStyle = "#ccc"; //setting grid lines color

        let rowSum = 0;
        //drawing horizontal lines
        for (let r = 0; r <= visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];

            ctx.moveTo(0, rowSum - 0.5);
            ctx.lineTo(this.canvasWidth, rowSum - 0.5);
        }

        let colSum = 0;
        //drawing vertical lines
        for (let c = 0; c <= visibleCols; c++) {
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            ctx.moveTo(colSum - 0.5, 0);
            ctx.lineTo(colSum - 0.5, this.canvasHeight);
        }

        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";

        //drawing text
        // rowSum = 0;
        // for (let r = 0; r < visibleRows; r++) {
        //     const rowIndex = startRow + r;
        //     let colSum = 0;
        //     for (let c = 0; c < visibleCols; c++) {
        //         const colIndex = startCol + c;
        //         ctx.fillText(
        //             `R${rowIndex}C${colIndex}`,
        //             colSum + 5,
        //             rowSum + 15
        //         );
        //         colSum +=
        //             this.spreadsheet.colWidths[
        //                 this.spreadsheet.currentStartCol + c
        //             ];
        //     }
        //     rowSum +=
        //         this.spreadsheet.rowHeights[
        //             this.spreadsheet.currentStartRow + r
        //         ];
        // }
    }

    /**
     * Sets the canvas position (top and left offset).
     * @param {number} top - The top position in pixels.
     * @param {number} left - The left position in pixels.
     */
    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }

    /**
     * Highlights the currently selected column in the grid.
     * @param {number} startCol - The index of the first visible column.
     */
    highlightSelectedColumn(startCol) {
        if (this.spreadsheet.selectedColumn === null) return;

        const ctx = this.ctx;
        const { visibleCols } = this.config;
        let colSum = 0;

        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            const width =
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];

            if (colIndex === this.spreadsheet.selectedColumn) {
                ctx.fillStyle = "#E8F2EC"; // Light blue
                ctx.fillRect(colSum, 0, width, this.canvasHeight);
                break;
            }

            colSum += width;
        }
    }

    /**
     * Highlights the currently selected row in the grid.
     * @param {number} startRow - The index of the first visible row.
     */
    highlightSelectedRow(startRow) {
        if (this.spreadsheet.selectedRow === null) return;

        const ctx = this.ctx;
        const { visibleRows } = this.config;
        let rowSum = 0;

        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            const height =
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];

            if (rowIndex === this.spreadsheet.selectedRow) {
                ctx.fillStyle = "#E8F2EC"; // Light blue
                ctx.fillRect(0, rowSum, this.canvasWidth, height);
                break;
            }

            rowSum += height;
        }
    }

    /**
     * Adds mouse-based selection logic for cells and rows.
     */
    addSelectionEventListeners() {
        //for grid
        this.canvas.addEventListener("mousedown", (e) => {
            let rowSum = 0;
            let rect = this.canvas.getBoundingClientRect();
            let mouseY = e.clientY - rect.top;

            const currentStartRow = this.spreadsheet.currentStartRow;
            let row = 0;
            for (let r = 0; r < this.config.visibleRows; r++) {
                if (
                    rowSum + this.spreadsheet.rowHeights[currentStartRow + r] >
                    mouseY
                ) {
                    row = currentStartRow + r;
                    break;
                }
                rowSum += this.spreadsheet.rowHeights[currentStartRow + r];
            }

            let colSum = 0;
            let mouseX = e.clientX - rect.left;
            const currentStartCol = this.spreadsheet.currentStartCol;
            let col = 0;
            for (let c = 0; c < this.config.visibleCols; c++) {
                if (
                    colSum + this.spreadsheet.colWidths[currentStartCol + c] >
                    mouseX
                ) {
                    col = currentStartCol + c;
                    break;
                }
                colSum += this.spreadsheet.colWidths[currentStartCol + c];
            }
            this.spreadsheet.selectedCell = { row, col };
            this.spreadsheet.cellEditor.showEditor(row, col);
        });
    }
}

export default GridCanvas;
