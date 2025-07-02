import ColHeader from "./colHeader.js";
import RowHeader from "./rowHeader.js";
import GridCanvas from "./GridCanvas.js";
import CellEditor from "./CellEditor.js";
import ColumnResizer from "./ColumnResizer.js";
import RowResizer from "./RowResizer.js";

/**
 * Represents the main spreadsheet component that handles rendering, scrolling,
 * resizing, and selection interactions.
 */
class Spreadsheet {
    /**
     * @param {Object} config - Configuration for spreadsheet layout and behavior.
     */
    constructor(config) {
        this.config = config;

        //dynamic sizes of row and col
        this.colWidths = new Array(this.config.totalCols).fill(
            this.config.cellWidth
        );
        this.rowHeights = new Array(this.config.totalRows).fill(
            this.config.cellHeight
        );

        this.currentStartRow = 0;
        this.currentStartCol = 0;

        //creating grid, rowheader and colheader objects
        this.grid = new GridCanvas(this);
        this.rowHeader = new RowHeader(this);
        this.colHeader = new ColHeader(this);
        this.topLeft = document.getElementById("topLeft");

        this.scrollContainer = document.getElementById("scrollContainer");
        this.scrollContainer.addEventListener(
            "scroll",
            this.handleScroll.bind(this)
        ); //adding event listner

        this.selectedCell = null; // Initially no cell selected
        this.selectedRow = null; // Initially no rows selected
        this.selectedColumn = null; // Initially no columns selected

        this.cellEditor = new CellEditor(this);

        // Initial render
        this.grid.draw(0, 0);
        this.rowHeader.draw(0);
        this.colHeader.draw(0);

        // Create Resizer instances
        this.columnResizer = new ColumnResizer(this);
        this.rowResizer = new RowResizer(this);

        // Adding event listeners for selection
        this.addSelectionEventListeners();

        //deselect the selected column when clicking outside
        this.initColumnSelectionDeselect();

        this.initRowSelectionDeselect();
    }

    /**
     * Handles scrolling of the grid and triggers redrawing of visible elements.
     */
    handleScroll() {
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollLeft = this.scrollContainer.scrollLeft;

        //calculate start row and col
        let rowSum = 0;
        let startRow = 0;

        while (
            startRow < this.config.totalRows &&
            rowSum + this.rowHeights[startRow] < scrollTop
        ) {
            rowSum += this.rowHeights[startRow++];
        }

        let colSum = 0,
            startCol = 0;
        while (
            startCol < this.config.totalCols &&
            colSum + this.colWidths[startCol] < scrollLeft
        ) {
            colSum += this.colWidths[startCol++];
        }

        this.currentStartCol = startCol;
        this.currentStartRow = startRow;

        // console.log(this.rowHeader.canvas.style.left, " ", scrollLeft)
        this.rowHeader.setPosition(rowSum + this.config.cellHeight, scrollLeft);
        this.colHeader.setPosition(scrollTop, colSum + this.config.rowWidth);
        this.grid.setPosition(
            rowSum + this.config.cellHeight,
            colSum + this.config.rowWidth
        );
        this.topLeft.style.top = `${scrollTop}px`;
        this.topLeft.style.left = `${scrollLeft}px`;

        this.colHeader.draw(this.currentStartCol);
        this.rowHeader.draw(this.currentStartRow);
        this.grid.draw(this.currentStartRow, this.currentStartCol);
    }

    /**
     * Calculates the total width of a given number of columns starting from a column index.
     * @param {number} startCol - Starting column index.
     * @param {number} count - Number of columns.
     * @returns {number} Total width.
     */
    sumWidths(startCol, count) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += this.colWidths[startCol + i];
        }
        return sum;
    }

    /**
     * Calculates the total height of a given number of rows starting from a row index.
     * @param {number} startRow - Starting row index.
     * @param {number} count - Number of rows.
     * @returns {number} Total height.
     */
    sumHeight(startRow, count) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += this.rowHeights[startRow + i];
        }
        return sum;
    }

    /**
     * Updates the view after a resize operation (row or column).
     */
    updateAfterResize() {
        this.handleScroll();
    }

    /**
     * Adds mouse-based selection logic for cells and rows.
     */
    addSelectionEventListeners() {
        //for grid
        this.grid.canvas.addEventListener("mousedown", (e) => {
            let rowSum = 0;
            let rect = this.grid.canvas.getBoundingClientRect();
            let mouseY = e.clientY - rect.top;

            let row = 0;
            for (let r = 0; r < this.config.visibleRows; r++) {
                if (
                    rowSum + this.rowHeights[this.currentStartRow + r] >
                    mouseY
                ) {
                    row = this.currentStartRow + r;
                    break;
                }
                rowSum += this.rowHeights[this.currentStartRow + r];
            }

            let colSum = 0;
            let mouseX = e.clientX - rect.left;

            let col = 0;
            for (let c = 0; c < this.config.visibleCols; c++) {
                if (
                    colSum + this.colWidths[this.currentStartCol + c] >
                    mouseX
                ) {
                    col = this.currentStartCol + c;
                    break;
                }
                colSum += this.colWidths[this.currentStartCol + c];
            }
            this.selectedCell = { row, col };
            this.cellEditor.showEditor(row, col);
        });
    }

    initColumnSelectionDeselect() {
        // Clicking on row header or grid clears the selected column
        this.rowHeader.canvas.addEventListener("mousedown", () => {
            if (this.selectedColumn !== null) {
                this.selectedColumn = null;
                this.grid.draw(this.currentStartRow, this.currentStartCol);
                this.colHeader.draw(this.currentStartCol);
                this.rowHeader.draw(this.currentStartRow);
            }
        });

        this.grid.canvas.addEventListener("mousedown", () => {
            if (this.selectedColumn !== null) {
                this.selectedColumn = null;
                this.grid.draw(this.currentStartRow, this.currentStartCol);
                this.colHeader.draw(this.currentStartCol);
                this.rowHeader.draw(this.currentStartRow);
            }
        });
    }

    initRowSelectionDeselect() {
        this.grid.canvas.addEventListener("mousedown", () => {
            if (this.selectedRow !== null) {
                this.selectedRow = null;
                this.grid.draw(this.currentStartRow, this.currentStartCol);
                this.rowHeader.draw(this.currentStartRow);
                this.colHeader.draw(this.currentStartCol);
            }
        });

        this.colHeader.canvas.addEventListener("mousedown", () => {
            if (this.selectedRow !== null) {
                this.selectedRow = null;
                this.grid.draw(this.currentStartRow, this.currentStartCol);
                this.rowHeader.draw(this.currentStartRow);
                this.colHeader.draw(this.currentStartCol);
            }
        });
    }
}

export default Spreadsheet;
