import ColHeader from "../components/ColHeader.js";
import RowHeader from "../components/RowHeader.js";
import GridCanvas from "../components/GridCanvas.js";
import CellEditor from "../components/CellEditor.js";
import ColumnResizer from "../resizers/ColumnResizer.js";
import RowResizer from "../resizers/RowResizer.js";
import GridData from "./GridData .js";
import SelectionManager from "../events/SelectionManager.js";
import CommandManager from "../core/CommandManager.js";

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

        //create #scrollContainer div and append to body
        const scrollContainer = document.createElement("div");
        scrollContainer.id = "scrollContainer";
        document.body.prepend(scrollContainer);

        const fakeContent = document.createElement("div");
        fakeContent.id = "fakeContent";
        scrollContainer.appendChild(fakeContent);
        const rowHeader = document.createElement("div");
        rowHeader.id = "rowHeader";
        scrollContainer.appendChild(rowHeader);
        const colHeader = document.createElement("div");
        colHeader.id = "colHeader";
        scrollContainer.appendChild(colHeader);
        const grid = document.createElement("div");
        grid.id = "grid";
        scrollContainer.appendChild(grid);

        const topLeft = document.createElement("div");
        topLeft.id = "topLeft";
        scrollContainer.appendChild(topLeft);

        const input = document.createElement("input");
        input.id = "input";
        input.type = "text";
        scrollContainer.appendChild(input);

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
        this.gridData = new GridData();
        this.topLeft = document.getElementById("topLeft");

        this.scrollContainer = document.getElementById("scrollContainer");
        this.scrollContainer.addEventListener(
            "scroll",
            this.handleScroll.bind(this)
        ); //adding event listner

        this.isScrollScheduled = false; // flag to track if rAF callback is queued

        this.selectedCell = null; // Initially no cell selected
        this.selectedRow = null; // Initially no rows selected
        this.selectedColumn = null; // Initially no columns selected
        this.isSelectingRange = false;
        this.isColumnAdder = false;
        this.isRowAdder = false;

        this.isColResizeIntent = false; // Shared coordination flag
        this.isRowResizeIntent = false; //Shared coordination flag

        this.cellEditor = new CellEditor(this);

        this.commandManager = new CommandManager();
        this.bindShortcuts();

        // Initial render
        this.grid.draw();
        this.rowHeader.draw();
        this.colHeader.draw();

        // Create Resizer instances
        this.columnResizer = new ColumnResizer(this);
        this.rowResizer = new RowResizer(this);

        //deselect the selected column when clicking outside
        this.colHeader.events.initColumnSelectionDeselect();

        this.rowHeader.events.initRowSelectionDeselect();

        this.selectionManager = new SelectionManager(this);
    }

    /**
     * Handles scrolling of the grid and triggers redrawing of visible elements.
     */
    handleScroll() {
        if (!this.isScrollScheduled) {
            this.isScrollScheduled = true;

            requestAnimationFrame(() => {
                this.isScrollScheduled = false;
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

                
                this.rowHeader.setPosition(
                    rowSum + this.config.cellHeight + this.config.topPadding,
                    scrollLeft
                );
                this.colHeader.setPosition(
                    scrollTop + this.config.topPadding,
                    colSum + this.config.rowWidth
                );
                this.grid.setPosition(
                    rowSum + this.config.cellHeight + this.config.topPadding,
                    colSum + this.config.rowWidth
                );
                this.topLeft.style.top = `${
                    scrollTop + this.config.topPadding
                }px`;
                this.topLeft.style.left = `${scrollLeft}px`;

                this.colHeader.draw();
                this.rowHeader.draw();
                this.grid.draw();
            });
        }
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
        this.colHeader.draw();
        this.rowHeader.draw();
        this.grid.draw();
    }

    bindShortcuts() {
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z") {
                e.preventDefault();
                this.commandManager.undo();
            }

            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === "y" || (e.shiftKey && e.key === "Z"))
            ) {
                e.preventDefault();
                this.commandManager.redo();
            }
        });
    }
}

export default Spreadsheet;
