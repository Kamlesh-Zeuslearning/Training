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
        // this.addSelectionEventListeners();

        document.getElementById("grid").appendChild(this.canvas); //add canvas to the html tree
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

        // console.log("hi")
        // Highlight selected column and row
        if (
            this.spreadsheet.selectedColumn !== null ||
            this.spreadsheet.selectedRow !== null
        ) {
            const range = this.spreadsheet.selectionManager.getSelectedRange();
            const { startRow, endRow, startCol, endCol } = range;
            if (startRow === -1 || endRow === -1) {
                this.highlightSelectedColumn(startCol, endCol);
            } else if (startCol === -1 || endCol === -1) {
                this.highlightSelectedRow(startRow, endRow);
            }
        }
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
        rowSum = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            let colSum = 0;

            for (let c = 0; c < visibleCols; c++) {
                const colIndex = startCol + c;
                if (this.spreadsheet.gridData.hasData(rowIndex, colIndex)) {
                    const cellValue = this.spreadsheet.gridData.getCellValue(
                        rowIndex,
                        colIndex
                    );

                    // Check if the value is a number
                    const isNumeric = !isNaN(cellValue) && cellValue !== "";
                    if (isNumeric) {
                        ctx.textAlign = "right";
                        ctx.fillText(
                            cellValue,
                            colSum +
                                this.spreadsheet.colWidths[
                                    this.spreadsheet.currentStartCol + c
                                ] -
                                5,
                            rowSum + 15
                        );
                    } else {
                        ctx.textAlign = "left";
                        ctx.fillText(cellValue, colSum + 5, rowSum + 15);
                    }
                }
                colSum +=
                    this.spreadsheet.colWidths[
                        this.spreadsheet.currentStartCol + c
                    ];
            }

            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
        }

        if (this.spreadsheet.isSelectingRange) {
            this.highlightSelectedRange();
        }
        if(this.spreadsheet.selectionManager){
            this.updateToolbarButtons();
        }
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
    highlightSelectedColumn(startCol, endCol) {
        if (this.spreadsheet.selectedColumn === null) return;

        const ctx = this.ctx;
        const { visibleCols } = this.config;
        let colSum = 0;

        let colIndex = this.spreadsheet.currentStartCol;
        for (let c = 0; c < visibleCols; c++) {
            const width = this.spreadsheet.colWidths[colIndex];

            if (colIndex >= startCol && colIndex <= endCol) {
                ctx.fillStyle = "#E8F2EC"; // Light blue
                ctx.fillRect(colSum, 0, width, this.canvasHeight);
            }
            colIndex++;
            colSum += width;
        }
    }

    /**
     * Highlights the currently selected row in the grid.
     * @param {number} startRow - The index of the first visible row.
     */
    highlightSelectedRow(startRow, endRow) {
        if (this.spreadsheet.selectedRow === null) return;

        const ctx = this.ctx;
        const { visibleRows } = this.config;
        let rowSum = 0;

        let rowIndex = this.spreadsheet.currentStartRow;
        for (let r = 0; r < visibleRows; r++) {
            const height = this.spreadsheet.rowHeights[rowIndex];

            if (rowIndex >= startRow && rowIndex <= endRow) {
                ctx.fillStyle = "#E8F2EC"; // Light blue
                ctx.fillRect(0, rowSum, this.canvasWidth, height);
            }
            rowIndex++;
            rowSum += height;
        }
    }

    highlightSelectedRange() {
        const range = this.spreadsheet.selectionManager.getSelectedRange();
        if (!range) return;

        const { startRow, endRow, startCol, endCol } = range;
        const ctx = this.ctx;

        // Calculate the top position based on the row heights and the current scroll position
        let top = this.spreadsheet.sumHeight(
            0,
            Math.min(this.spreadsheet.currentStartRow, startRow)
        );
        for (let r = this.spreadsheet.currentStartRow; r < startRow; r++) {
            top += this.spreadsheet.rowHeights[r];
        }

        // Calculate the left position based on the column widths and the current scroll position
        let left = this.spreadsheet.sumWidths(
            0,
            Math.min(this.spreadsheet.currentStartCol, startCol)
        );
        for (let c = this.spreadsheet.currentStartCol; c < startCol; c++) {
            left += this.spreadsheet.colWidths[c];
        }

        // Calculate the width of the selected range
        let width = 0;
        for (let c = startCol; c <= endCol; c++) {
            width += this.spreadsheet.colWidths[c];
        }

        // Calculate the height of the selected range
        let height = 0;
        for (let r = startRow; r <= endRow; r++) {
            height += this.spreadsheet.rowHeights[r];
        }

        // Ensure that top and left are adjusted based on the scroll position
        top -= this.spreadsheet.sumHeight(0, this.spreadsheet.currentStartRow);
        left -= this.spreadsheet.sumWidths(0, this.spreadsheet.currentStartCol);

        // Fill selection with transparent color
        ctx.fillStyle = "rgba(180, 215, 255, 0.3)";
        ctx.fillRect(left, top, width, height);

        // Add border around the selected range
        ctx.strokeStyle = "#107C41";
        ctx.lineWidth = 2;
        ctx.strokeRect(left + 1, top + 1, width - 2, height - 2); // slight inset for clean look

        // Reset lineWidth for other drawings
        ctx.lineWidth = 1;
    }

    updateToolbarButtons() {
        const range = this.spreadsheet.selectionManager.getSelectedRange();
        const isValid = !!range;
        
        const buttons = ["sumBtn", "minBtn", "maxBtn", "countBtn", "avgBtn"];
        buttons.forEach((id) => {
            document.getElementById(id).disabled = !isValid;
        });
    }
}

export default GridCanvas;
