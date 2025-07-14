import ColHeader from "../components/ColHeader.js";
import RowHeader from "../components/RowHeader.js";
import GridCanvas from "../components/GridCanvas.js";
import CellEditor from "../components/CellEditor.js";
import ColumnResizer from "../resizers/ColumnResizer.js";
import RowResizer from "../resizers/RowResizer.js";
import GridData from "./GridData .js";
import SelectionManager from "../events/SelectionManager.js";
import CommandManager from "../core/CommandManager.js";
import PointerDispatcher from "../events/PointerDispatcher.js";
import ColumnSelection from "../events/ColumnSelection.js";
import RowSelection from "../events/RowSelection.js";
import CellSelection from "../events/CellSelection.js";



/**
 * Manages DOM elements related to the spreadsheet.
 */
class DomManager {
    constructor() {
        this.scrollContainer = this.createElement("div", "scrollContainer");
        this.fakeContent = this.createElement("div", "fakeContent");
        this.rowHeader = this.createElement("div", "rowHeader");
        this.colHeader = this.createElement("div", "colHeader");
        this.grid = this.createElement("div", "grid");
        this.topLeft = this.createElement("div", "topLeft");
        this.input = this.createElement("input", "input");

        // Append elements
        this.scrollContainer.append(this.fakeContent, this.rowHeader, this.colHeader, this.grid, this.topLeft, this.input);
        document.body.prepend(this.scrollContainer);
    }

    createElement(tag, id) {
        const element = document.createElement(tag);
        element.id = id;
        return element;
    }

    getScrollContainer() {
        return this.scrollContainer;
    }

    getTopLeft() {
        return this.topLeft;
    }
}




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

        // the DomManager to handle DOM creation
        this.domManager = new DomManager();
        this.scrollContainer = this.domManager.getScrollContainer()

        //dynamic sizes of row and col
        this.colWidths = new Array(this.config.totalCols).fill(
            this.config.cellWidth
        );
        this.rowHeights = new Array(this.config.totalRows).fill(
            this.config.cellHeight
        );
        this.currentStartRow = 0;
        this.currentStartCol = 0;
        this.isScrollScheduled = false; // flag to track if rAF callback is queued


        //creating grid, rowheader and colheader objects
        this.grid = new GridCanvas(this);
        this.rowHeader = new RowHeader(this);
        this.colHeader = new ColHeader(this);
        this.gridData = new GridData();
        
        this.domManager.getScrollContainer().addEventListener("scroll", this.handleScroll.bind(this));


        this.selectedCell = null; // Initially no cell selected
        this.selectedRow = null; // Initially no rows selected
        this.selectedColumn = null; // Initially no columns selected
                

        this.cellEditor = new CellEditor(this);

        this.commandManager = new CommandManager();
        this.bindShortcuts();

        // Initial render
        this.render();

        

        this.selectionManager = new SelectionManager(this);

        this.dispatcher = new PointerDispatcher();

        this.cellSelection = new CellSelection(this, this.dispatcher)

        this.colResize = new ColumnResizer(this, this.dispatcher)
        this.colSelection = new ColumnSelection(this, this.dispatcher);

        this.rowResizer = new RowResizer(this, this.dispatcher)
        this.rowSelection = new RowSelection(this, this.dispatcher)
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
                this.domManager.getTopLeft().style.top = `${
                    scrollTop + this.config.topPadding
                }px`;
                this.domManager.getTopLeft().style.left = `${scrollLeft}px`;

                this.render();
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
    render() {
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
