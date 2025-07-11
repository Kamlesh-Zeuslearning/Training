class Spreadsheet {
    constructor(config) {
        this.config = config;

        // Dynamic sizes per column and row
        this.colWidths = new Array(this.config.totalCols).fill(
            this.config.cellWidth
        );
        this.rowHeights = new Array(this.config.totalRows).fill(
            this.config.cellHeight
        );

        this.currentStartRow = 0;
        this.currentStartCol = 0;

        // Setup canvases
        this.grid = new GridCanvas(this);
        this.rowHeader = new RowHeader(this);
        this.colHeader = new ColHeader(this);

        // Setup scrolling container and fake content
        this.scrollContainer = document.getElementById("scrollContainer");
        this.fakeContent = document.getElementById("fakeContent");
        this.topLeft = document.getElementById("topLeft");

        this.updateFakeContentSize();

        // Initial render
        this.colHeader.draw();
        this.grid.draw();
        this.rowHeader.draw();

        // Bind scroll event
        this.scrollContainer.addEventListener("scroll", () =>
            this.handleScroll()
        );

        // Setup column resizing events
        this.initColumnResizing();
    }

    sumWidths(start, count) {
        let sum = 0;
        for (
            let i = start;
            i < start + count && i < this.colWidths.length;
            i++
        ) {
            sum += this.colWidths[i];
        }
        return sum;
    }

    sumHeights(start, count) {
        let sum = 0;
        for (
            let i = start;
            i < start + count && i < this.rowHeights.length;
            i++
        ) {
            sum += this.rowHeights[i];
        }
        return sum;
    }

    updateFakeContentSize() {
        this.fakeContent.style.width =
            this.sumWidths(0, this.config.totalCols) + "px";
        this.fakeContent.style.height =
            this.sumHeights(0, this.config.totalRows) + "px";
    }

    handleScroll() {
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollLeft = this.scrollContainer.scrollLeft;

        // Calculate start row and col by accumulating heights and widths
        let rowSum = 0,
            startRow = 0;
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

        this.currentStartRow = startRow;
        this.currentStartCol = startCol;

        // Position canvases
        this.grid.setPosition(20 + rowSum, 50 + colSum);
        this.rowHeader.setPosition(20 + rowSum, scrollLeft);
        this.colHeader.setPosition(scrollTop, 50 + colSum);
        this.topLeft.style.top = scrollTop + "px";
        this.topLeft.style.left = scrollLeft + "px";

        // Update canvas sizes before drawing
        this.grid.updateCanvasSize();
        this.rowHeader.updateCanvasSize();
        this.colHeader.updateCanvasSize();

        // Draw visible parts
        this.grid.draw();
        this.rowHeader.draw();
        this.colHeader.draw();
    }

    initColumnResizing() {
        const colCanvas = this.colHeader.canvas;
        let isResizing = false;
        let startX = 0;
        let resizingColIndex = null;
        const resizeThreshold = 5;

        colCanvas.style.cursor = "default";

        colCanvas.addEventListener("mousemove", (e) => {
            if (isResizing) return;

            const rect = colCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            let accWidth = 0;
            resizingColIndex = null;

            for (let i = 0; i < this.config.visibleCols; i++) {
                accWidth +=
                    this.colWidths[this.currentStartCol + i] ||
                    this.config.cellWidth;
                if (Math.abs(mouseX - accWidth) < resizeThreshold) {
                    resizingColIndex = this.currentStartCol + i;
                    break;
                }
            }

            colCanvas.style.cursor =
                resizingColIndex !== null ? "col-resize" : "default";
        });

        colCanvas.addEventListener("mousedown", (e) => {
            if (resizingColIndex === null) return;
            isResizing = true;
            startX = e.clientX;
            this.resizingColIndex = resizingColIndex;
            this.startColWidth = this.colWidths[resizingColIndex];
        });

        window.addEventListener("mouseup", () => {
            if (isResizing) {
                isResizing = false;
                this.resizingColIndex = null;
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            const delta = e.clientX - startX;
            const newWidth = this.startColWidth + delta;

            if (newWidth > 20) {
                // minimum width
                this.colWidths[this.resizingColIndex] = newWidth;
                this.updateAfterResize();
            }
        });
    }

    updateAfterResize() {
        this.updateFakeContentSize();
        this.handleScroll();
    }
}

class GridCanvas {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "20px";
        this.canvas.style.left = "50px";
        this.canvas.style.zIndex = 10;

        document.getElementById("container").appendChild(this.canvas);

        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const width = this.spreadsheet.sumWidths(
            this.spreadsheet.currentStartCol,
            this.config.visibleCols
        );
        const height = this.spreadsheet.sumHeights(
            this.spreadsheet.currentStartRow,
            this.config.visibleRows
        );

        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;

        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }

    setPosition(top, left) {
        this.canvas.style.top = top + "px";
        this.canvas.style.left = left + "px";
    }

    draw(startRow, startCol) {
        const ctx = this.ctx;
        const { visibleRows, visibleCols } = this.config;
        const colWidths = this.spreadsheet.colWidths;
        const rowHeights = this.spreadsheet.rowHeights;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";

        // Horizontal lines
        let yPos = 0;
        for (let r = 0; r <= visibleRows; r++) {
            ctx.moveTo(0, yPos + 0.5);
            ctx.lineTo(this.canvas.width / this.dpr, yPos + 0.5);
            if (r < visibleRows)
                yPos += rowHeights[startRow + r] || this.config.cellHeight;
        }

        // Vertical lines
        let xPos = 0;
        for (let c = 0; c <= visibleCols; c++) {
            ctx.moveTo(xPos + 0.5, 0);
            ctx.lineTo(xPos + 0.5, this.canvas.height / this.dpr);
            if (c < visibleCols)
                xPos += colWidths[startCol + c] || this.config.cellWidth;
        }
        ctx.stroke();

        // Draw text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";

        yPos = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            if (rowIndex >= this.config.totalRows) break;

            xPos = 0;
            for (let c = 0; c < visibleCols; c++) {
                const colIndex = startCol + c;
                if (colIndex >= this.config.totalCols) break;

                const text = `R${rowIndex}C${colIndex}`;
                ctx.fillText(text, xPos + 5, yPos + 15);
                xPos += colWidths[colIndex];
            }
            yPos += rowHeights[rowIndex];
        }
    }
}

class RowHeader {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;

        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 11;
        this.canvas.style.backgroundColor = "rgb(227, 236, 234)";
        this.canvas.style.top = "20px";

        document.getElementById("rowHeader").appendChild(this.canvas);

        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const height = this.spreadsheet.sumHeights(
            this.spreadsheet.currentStartRow,
            this.config.visibleRows
        );
        this.canvas.width = 50 * this.dpr;
        this.canvas.height = height * this.dpr;

        this.canvas.style.width = "50px";
        this.canvas.style.height = height + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }

    setPosition(top, left) {
        this.canvas.style.top = top + "px";

        this.canvas.style.left = left + "px";
    }

    draw(startRow) {
        const ctx = this.ctx;

        const { visibleRows } = this.config;

        const rowHeights = this.spreadsheet.rowHeights;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw horizontal lines
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        let yPos = 0;
        for (let r = 0; r <= visibleRows; r++) {
            ctx.moveTo(0, yPos + 0.5);
            ctx.lineTo(this.canvas.width / this.dpr, yPos + 0.5);
            if (r < visibleRows)
                yPos += rowHeights[startRow + r] || this.config.cellHeight;
        }
        ctx.stroke();

        // Draw row numbers
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";

        yPos = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            if (rowIndex >= this.config.totalRows) break;

            const h = rowHeights[rowIndex] || this.config.cellHeight;
            ctx.fillText(rowIndex + 1, 5, yPos + 15);
            yPos += h;
        }
    }
}

class ColHeader {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;

        this.config = spreadsheet.config;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;

        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 11;
        this.canvas.style.backgroundColor = "rgb(227, 236, 234)";
        this.canvas.style.left = "50px";

        document.getElementById("colHeader").appendChild(this.canvas);

        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const width = this.spreadsheet.sumWidths(
            this.spreadsheet.currentStartCol,
            this.config.visibleCols
        );

        this.canvas.width = width * this.dpr;
        this.canvas.height = 20 * this.dpr;

        this.canvas.style.width = width + "px";
        this.canvas.style.height = "20px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }

    setPosition(top, left) {
        this.canvas.style.top = top + "px";
        this.canvas.style.left = left + "px";
    }

    draw(startCol) {
        const ctx = this.ctx;

        const { visibleCols } = this.config;

        const colWidths = this.spreadsheet.colWidths;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw vertical lines
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";

        let xPos = 0;
        for (let c = 0; c <= visibleCols; c++) {
            ctx.moveTo(xPos + 0.5, 0);
            ctx.lineTo(xPos + 0.5, this.canvas.height / this.dpr);
            if (c < visibleCols)
                xPos += colWidths[startCol + c] || this.config.cellWidth;
        }
        ctx.stroke();

        // Draw column letters (A, B, C...)
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";

        xPos = 0;
        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            if (colIndex >= this.config.totalCols) break;

            const letter = String.fromCharCode(65 + (colIndex % 26));
            ctx.fillText(letter, xPos + 5, 15);
            xPos += colWidths[colIndex];
        }
    }
}

// === Init ===

const config = {
    cellWidth: 50,

    cellHeight: 20,

    totalRows: 100000,

    totalCols: 1000,

    visibleRows: 40,

    visibleCols: 35,
};

window.onload = () => {
    window.spreadsheet = new Spreadsheet(config);

    spreadsheet.handleScroll(); // initial layout and draw
};
