/* -------   col header ----------*/
class ColHeader {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.config = spreadsheet.config;
        this.canvasWidth = this.config.cellWidth * this.config.visibleCols;

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
        let colSum = 0;
        for (let c = 0; c < visibleCols; c++) {
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            ctx.moveTo(colSum - 0.5, 0);
            ctx.lineTo(colSum - 0.5, this.config.cellHeight);
        }

        // drawing bottom line
        ctx.moveTo(0, this.config.cellHeight - 0.5);
        ctx.lineTo(this.canvasWidth, this.config.cellHeight - 0.5);
        ctx.stroke();

        //style for text
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";

        colSum = 0;
        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            colSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];
            let index = this.getIndex(colIndex + 1);
            ctx.fillText(
                index,
                colSum -
                    this.spreadsheet.colWidths[
                        this.spreadsheet.currentStartCol + c
                    ] /
                        2,
                15
            );
        }
    }

    setPosition(top, left) {
        this.canvas.style.top = `${top}px`;
        this.canvas.style.left = `${left}px`;
    }

    getIndex(num) {
        let result = "";

        while (num > 0) {
            num--; // Decrease by 1 to handle the 1-based index
            result = String.fromCharCode((num % 26) + 65) + result; // Convert to letter and append to result
            num = Math.floor(num / 26); // Divide by 26 to process the next "digit"
        }

        return result;
    }
}

export default ColHeader;
