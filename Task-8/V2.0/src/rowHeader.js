/* -------   Row header ----------*/
class RowHeader {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasHeight = this.config.cellHeight * this.config.visibleRows;

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
        let rowSum = 0;
        //drawing horizontal lines
        for (let r = 0; r < visibleRows; r++) {
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
            ctx.moveTo(0, rowSum + 0.5);
            ctx.lineTo(this.config.cellWidth, rowSum + 0.5);
        }

        //drawing right border for rowHeader
        ctx.moveTo(this.config.cellWidth - 0.5, 0);
        ctx.lineTo(this.config.cellWidth - 0.5, this.canvasHeight);
        ctx.stroke();

        //styles for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "end";

        rowSum = 0;
        for (let r = 0; r < visibleRows; r++) {
            const rowIndex = startRow + r;
            ctx.fillText(rowIndex, this.config.cellWidth - 5, rowSum + 15);
            rowSum +=
                this.spreadsheet.rowHeights[
                    this.spreadsheet.currentStartRow + r
                ];
        }
    }

    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }
}


export default RowHeader;