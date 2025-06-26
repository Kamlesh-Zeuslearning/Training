//basic grid dimensions
const config = {
    cellWidth: 70,
    cellHeight: 30,
    totalRows: 100000,
    totalCols: 1000,
    visibleRows: 40,
    visibleCols: 35,
};

//main canvas
class GridCanvas {
    constructor(containerId, config) {
        this.config = config;
        this.canvasWidth = config.cellWidth * config.visibleCols;
        this.canvasHeight = config.cellHeight * config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        //adding eventlistner to get row-col index
        this.canvas.addEventListener("mousedown", getIndex);

        document.getElementById(containerId).appendChild(this.canvas); //add canvas to the html tree
    }

    //function for basic setup of canvas dpr
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

    //function to draw canvas
    draw(startRow, startCol) {
        const { cellWidth, cellHeight, visibleRows, visibleCols, totalCols } =
            this.config;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.beginPath();
        ctx.strokeStyle = "#ccc"; //setting grid lines color

        //drawing horizontal lines
        for (let r = 0; r <= visibleRows; r++) {
            const y = r * cellHeight;
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.canvasWidth, y + 0.5);
        }

        //drawing vertical lines
        for (let c = 0; c <= visibleCols; c++) {
            const x = c * cellWidth;
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.canvasHeight);
        }

        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";

        //drawing text
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            for (let c = 0; c < visibleCols; c++) {
                const colIndex = startCol + c;
                if (colIndex >= totalCols) break;
                ctx.fillText(
                    `R${rowIndex}C${colIndex}`,
                    c * cellWidth + 5,
                    r * cellHeight + 15
                );
            }
        }
    }

    //function to update canvas position
    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }


}

/* -------   Row header ----------*/
class RowHeader {
    constructor(containerId, config) {
        this.config = config;
        this.canvasHeight = config.cellHeight * config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById(containerId).appendChild(this.canvas);
    }

    //basic setup and canvas creation
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

    draw(startRow) {
        const { cellHeight, visibleRows } = this.config;
        const ctx = this.ctx;
        // console.log(this.config.cellWidth, "hi")
        ctx.clearRect(0, 0, this.config.cellWidth, this.canvasHeight);
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";

        //drawing horizontal lines
        for (let r = 0; r < visibleRows; r++) {
            const y = r * cellHeight;
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.config.cellWidth, y + 0.5);
        }

        //drawing right border for rowHeader
        ctx.moveTo(this.config.cellWidth-0.5, 0);
        ctx.lineTo(this.config.cellWidth-0.5, this.canvasHeight);
        ctx.stroke();

        //styles for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "end";

        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            ctx.fillText(rowIndex, 45, r * cellHeight + 15);
        }
    }

    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}

/* -------   col header ----------*/
class ColHeader {
    constructor(containerId, config) {
        this.config = config;
        this.canvasWidth = config.cellWidth * config.visibleCols;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById(containerId).appendChild(this.canvas);
    }

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

    draw(startCol) {
        const { cellWidth, visibleCols } = this.config;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasWidth, this.config.cellHeight);
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";

        //drawing vertical lines
        for (let c = 0; c < visibleCols; c++) {
            const x = c * cellWidth;
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.config.cellHeight);
        }

        // drawing bottom line
        ctx.moveTo(0, this.config.cellHeight - 0.5);
        ctx.lineTo(this.canvasWidth, this.config.cellHeight - 0.5);
        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";

        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;

            let index = getIndex(colIndex + 1);
            ctx.fillText(index, c * cellWidth + cellWidth / 2, 15);
        }
    }

    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}

function getIndex(num) {
    let result = "";

    while (num > 0) {
        num--; // Decrease by 1 to handle the 1-based index
        result = String.fromCharCode((num % 26) + 65) + result; // Convert to letter and append to result
        num = Math.floor(num / 26); // Divide by 26 to process the next "digit"
    }

    return result;
}

/* -------   Spreadsheet ----------*/
class Spreadsheet {
    constructor(config) {
        this.config = config;

        //creating grid, rowheader and colheader objects
        this.grid = new GridCanvas("container", config);
        this.rowHeader = new RowHeader("rowHeader", config);
        this.colHeader = new ColHeader("colHeader", config);
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
    }

    //function to handle redraw the canvas when scrolling
    handleScroll() {
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollLeft = this.scrollContainer.scrollLeft;

        if (scrollLeft >= 50000) return;

        const { cellWidth, cellHeight } = this.config;
        const startRow = Math.floor(scrollTop / cellHeight);
        const startCol = Math.floor(scrollLeft / cellWidth);

        const canvasTop = startRow * cellHeight;
        const canvasLeft = startCol * cellWidth;
        
        // console.log(this.rowHeader.canvas.style.left, " ", scrollLeft)
        this.rowHeader.setPosition(canvasTop + cellHeight, scrollLeft);
        this.rowHeader.draw(startRow);
        
        this.colHeader.setPosition(scrollTop, canvasLeft + cellWidth);
        this.colHeader.draw(startCol);
        
        this.grid.setPosition(canvasTop + cellHeight, canvasLeft + cellWidth);
        this.grid.draw(startRow, startCol);

        this.topLeft.style.top = `${scrollTop}px`;
        this.topLeft.style.left = `${scrollLeft}px`;
    }
}

const spreadsheet = new Spreadsheet(config);
