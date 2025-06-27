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
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet
        this.config = spreadsheet.config;
        this.canvasWidth = config.cellWidth * config.visibleCols;
        this.canvasHeight = config.cellHeight * config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        //adding eventlistner to get row-col index
        this.canvas.addEventListener("mousedown", getIndex);

        document.getElementById("container").appendChild(this.canvas); //add canvas to the html tree
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
        
        let colSum = 0;
        //drawing vertical lines
        for (let c = 0; c <= visibleCols; c++) {
            colSum += this.spreadsheet.colWidths[this.spreadsheet.currentStartCol+c]
            ctx.moveTo(colSum + 0.5, 0);
            ctx.lineTo(colSum + 0.5, this.canvasHeight);
        }

        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";

        //drawing text
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            let colSum = 0;
            for (let c = 0; c < visibleCols; c++) {
                const colIndex = startCol + c;
                ctx.fillText(
                    `R${rowIndex}C${colIndex}`,
                    colSum + 5,
                    r * cellHeight + 15
                );
                colSum += this.spreadsheet.colWidths[this.spreadsheet.currentStartCol+c]
                
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
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet
        this.config = spreadsheet.config;
        this.canvasHeight = config.cellHeight * config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById("rowHeader").appendChild(this.canvas);
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
        ctx.moveTo(this.config.cellWidth - 0.5, 0);
        ctx.lineTo(this.config.cellWidth - 0.5, this.canvasHeight);
        ctx.stroke();

        //styles for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "end";

        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            ctx.fillText(
                rowIndex,
                this.config.cellWidth - 5,
                r * cellHeight + 15
            );
        }
    }

    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}

/* -------   col header ----------*/
class ColHeader {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet
        this.config = spreadsheet.config;
        this.canvasWidth = config.cellWidth * config.visibleCols;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        document.getElementById("colHeader").appendChild(this.canvas);
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
        let colSum = 0
        for (let c = 0; c < visibleCols; c++) {
            colSum += this.spreadsheet.colWidths[this.spreadsheet.currentStartCol+ c] 
            ctx.moveTo( colSum + 0.5, 0);
            ctx.lineTo(colSum+ 0.5, this.config.cellHeight);
        }

        // drawing bottom line
        ctx.moveTo(0, this.config.cellHeight - 0.5);
        ctx.lineTo(this.canvasWidth, this.config.cellHeight - 0.5);
        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";

        colSum = 0
        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            colSum += this.spreadsheet.colWidths[this.spreadsheet.currentStartCol+ c] 
            let index = getIndex(colIndex + 1);
            ctx.fillText(index, colSum - (this.spreadsheet.colWidths[this.spreadsheet.currentStartCol+ c] /2) , 15);
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
        let colIndex = 0
        let startX = 0
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
            if(colIndex === null) return
            resize = true;
            startX = e.clientX;
            this.colIndex = colIndex
            this.startColWidth = this.colWidths[this.colIndex]
        });

        window.addEventListener("mouseup", (e) => {
            if (resize) {
                resize = false;
                this.colIndex = null
            }
        });

        window.addEventListener("mousemove", (e) => {   
            if(!resize) return

            const delta = e.clientX - startX;
            const newWidth = this.startColWidth + delta;

            if(newWidth > 20){
                this.colWidths[this.colIndex] = newWidth
                this.updateAfterResize()
                console.log(newWidth)
            }
        }); 
    }

    updateAfterResize(){
        this.handleScroll();
    }
}

const spreadsheet = new Spreadsheet(config);
