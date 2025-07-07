import ResizeColumnCommand from "../commands/ResizeColumnCommand.js";

export default class ColumnResizer {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.resize = false;
        this.colIndex = null;
        this.startX = 0;
        this.startColWidth = 0;
        this.threshold = 5; // Sensitivity for resizing

        this.addEventListeners();
    }

    addEventListeners() {
        const colHeaderCanvas = this.spreadsheet.colHeader.canvas;

        colHeaderCanvas.addEventListener("mousemove", (e) =>
            this.onMouseMove(e)
        );
        colHeaderCanvas.addEventListener("mousedown", (e) =>
            this.onMouseDown(e)
        );
        window.addEventListener("mouseup", () => this.onMouseUp());
        window.addEventListener("mousemove", (e) => this.onMouseResize(e));
    }

    onMouseMove(e) {
        if (this.resize) return;

        const rect = this.spreadsheet.colHeader.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        let widthSum = 0;
        this.colIndex = null;

        for (let c = 0; c < this.spreadsheet.config.visibleCols; c++) {
            widthSum +=
                this.spreadsheet.colWidths[
                    this.spreadsheet.currentStartCol + c
                ];

            if (Math.abs(mouseX - widthSum) < this.threshold) {
                this.colIndex = this.spreadsheet.currentStartCol + c;
                break;
            }
        }

        // 👇 Shared flag — tells the selection handler that resizing is "armed"
        this.spreadsheet.isColResizeIntent = this.colIndex !== null;

        this.spreadsheet.colHeader.canvas.style.cursor =
            this.colIndex === null ? "default" : "col-resize";

        // if(e.clientY - th)
        // const rect2 = .getBoundingClientRect()

        // console.log(rect2.top)

        // console.log(e.clientY, this.spreadsheet.colHeader.canvas.offsetTop)
        if (this.colIndex !== null) {
            if (e.clientY <= 60) {
                this.spreadsheet.colHeader.canvas.style.cursor = "cell";
            } else {
                this.spreadsheet.colHeader.canvas.style.cursor = "col-resize";
            }
        }
    }

    onMouseDown(e) {
        if (this.colIndex === null) return;
        this.resize = true;
        this.startX = e.clientX;
        this.startColWidth = this.spreadsheet.colWidths[this.colIndex];
    }

    onMouseUp() {
        if (this.resize) {
            this.resize = false;

            const finalWidth = this.spreadsheet.colWidths[this.colIndex];
            if (finalWidth !== this.startColWidth) {
                const cmd = new ResizeColumnCommand(
                    this.spreadsheet,
                    this.colIndex,
                    this.startColWidth,
                    finalWidth
                );
                this.spreadsheet.commandManager.executeCommand(cmd);
            }
            this.colIndex = null;
        }
        this.spreadsheet.isColResizeIntent = false; //flag
        // console.log(this.spreadsheet.isSelectingRange)
    }

    onMouseResize(e) {
        if (!this.resize) return;

        window.requestAnimationFrame(() => {
            const delta = e.clientX - this.startX;
            const newWidth = this.startColWidth + delta;
            if (newWidth > 20) {
                this.spreadsheet.colWidths[this.colIndex] = newWidth;
                this.spreadsheet.updateAfterResize();
                let selectedCell = this.spreadsheet.selectedCell;
                if (selectedCell) {
                    this.spreadsheet.cellEditor.showEditor(
                        selectedCell.row,
                        selectedCell.col
                    ); //resize celleditor
                }
            }
        });
    }
}
