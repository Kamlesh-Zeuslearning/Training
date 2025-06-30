import ColHeader from "./src/colHeader.js";
import RowHeader from "./src/rowHeader.js";
import GridCanvas from "./src/GridCanvas.js";

/* -------   Spreadsheet ----------*/
class Spreadsheet {
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

        // Initial render
        this.grid.draw(0, 0);
        this.rowHeader.draw(0);
        this.colHeader.draw(0);

        //columns resizing setup
        this.initColumnResizing();

        this.initRowResizing();
    }

    //function to handle redraw the canvas when scrolling
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
        this.colHeader.setPosition(scrollTop, colSum + this.config.cellWidth);
        this.grid.setPosition(
            rowSum + this.config.cellHeight,
            colSum + this.config.cellWidth
        );
        this.topLeft.style.top = `${scrollTop}px`;
        this.topLeft.style.left = `${scrollLeft}px`;

        this.colHeader.draw(this.currentStartCol);
        this.rowHeader.draw(this.currentStartRow);
        this.grid.draw(this.currentStartRow, this.currentStartCol);
    }

    //function to calculate sum of width of col
    sumWidths(startCol, count) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += this.colWidths[startCol + i];
        }
        return sum;
    }

    sumHeight(startRow, count) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += this.rowHeights[startRow + i];
        }
        return sum;
    }

    initColumnResizing() {
        let resize = false;
        let colIndex = 0;
        let startX = 0;

        //eventlistner for colresize cursor
        this.colHeader.canvas.addEventListener("mousemove", (e) => {
            if (resize) return;

            const rect = this.colHeader.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const thresold = 5;
            let widthSum = 0;
            colIndex = null;
            for (let c = 0; c < this.config.visibleCols; c++) {
                widthSum += this.colWidths[this.currentStartCol + c];

                if (Math.abs(mouseX - widthSum) < thresold) {
                    colIndex = this.currentStartCol + c;
                    break;
                }
            }
            this.colHeader.canvas.style.cursor =
                colIndex === null ? "default" : "col-resize";
        });

        //eventlistner for changing colresize
        this.colHeader.canvas.addEventListener("mousedown", (e) => {
            if (colIndex === null) return;
            resize = true;
            startX = e.clientX;
            this.colIndex = colIndex;
            this.startColWidth = this.colWidths[this.colIndex];
        });

        window.addEventListener("mouseup", (e) => {
            if (resize) {
                resize = false;
                this.colIndex = null;
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (!resize) return;

            const delta = e.clientX - startX;
            const newWidth = this.startColWidth + delta;

            if (newWidth > 20) {
                this.colWidths[this.colIndex] = newWidth;
                this.updateAfterResize();
            }
        });
    }

    initRowResizing() {
        let rowIndex = null;
        let rowResize = false;
        let startY = 0;
        let startRowHeight = 0;

        this.rowHeader.canvas.addEventListener("mousemove", (e) => {
            if (rowResize) return;

            let rect = this.rowHeader.canvas.getBoundingClientRect();
            let mouseY = e.clientY - rect.top;
            let thresold = 5;
            let rowSum = 0;
            rowIndex = null;
            for (let i = 0; i < this.config.visibleRows; i++) {
                rowSum += this.rowHeights[this.currentStartRow + i];
                if (Math.abs(rowSum - mouseY) < thresold) {
                    rowIndex = this.currentStartRow + i;
                    break;
                }
            }

            this.rowHeader.canvas.style.cursor =
                rowIndex === null ? "default" : "row-resize";
        });

        this.rowHeader.canvas.addEventListener("mousedown", (e) => {
            if (rowIndex == null) return;
            rowResize = true;
            this.rowIndex = rowIndex;
            startY = e.clientY;
            startRowHeight = this.rowHeights[rowIndex];
        });

        window.addEventListener("mouseup", () => {
            if (rowResize) {
                rowResize = false;
                rowIndex = null;
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (rowResize) {
                const delta = e.clientY - startY;
                const newHeight = startRowHeight + delta;
                if (newHeight > 20) {
                    this.rowHeights[rowIndex] = newHeight;
                    this.updateAfterResize();
                }
            }
        });
    }

    updateAfterResize() {
        this.handleScroll();
    }
}

export default Spreadsheet;
