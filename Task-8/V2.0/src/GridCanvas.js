//main canvas
class GridCanvas {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasWidth = this.config.cellWidth * this.config.visibleCols;
        this.canvasHeight = this.config.cellHeight * this.config.visibleRows;

        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

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

        let rowSum = 0;
        //drawing horizontal lines
        for (let r = 0; r <= visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];

            ctx.moveTo(0, rowSum + 0.5);
            ctx.lineTo(this.canvasWidth, rowSum + 0.5);
        }

        let colSum = 0;
        //drawing vertical lines
        for (let c = 0; c <= visibleCols; c++) {
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            ctx.moveTo(colSum + 0.5, 0);
            ctx.lineTo(colSum + 0.5, this.canvasHeight);
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
                ctx.fillText(
                    `R${rowIndex}C${colIndex}`,
                    colSum + 5,
                    rowSum + 15
                );
                colSum +=
                    this.spreadsheet.colWidths[
                        this.spreadsheet.currentStartCol + c
                    ];
            }
            rowSum += this.spreadsheet.rowHeights[this.spreadsheet.currentStartRow + r];
        }
    }

    //function to update canvas position
    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}

export default GridCanvas;