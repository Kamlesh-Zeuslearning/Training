class CellEditor {
    /**
     * @param {Spreadsheet} spreadsheet - Reference to the main spreadsheet instance.
     */
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        this.inputField = document.getElementById("input");

        this.initListeners();
    }

    initListeners() {
        // Basic input commit on blur (you can expand this for key events later)
        // this.inputField.addEventListener("blur", () => {
        //     this.commitInput(); // when you change screen it hides
        // });

        this.inputField.addEventListener("keydown", (e) => {
            // Placeholder: Escape key cancels input
            if (e.key === "Escape") {
                this.hideInput();
            }
            // handle navigation here
            // Commit input before navigating
            else if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                this.commitInput();
                if (e.key === "ArrowDown") {
                    this.spreadsheet.selectedCell.row++;
                } else if (e.key === "ArrowUp") {
                    if (this.spreadsheet.selectedCell.row > 0) {
                        this.spreadsheet.selectedCell.row--;
                    }
                } else if (e.key === "ArrowRight") {
                    this.spreadsheet.selectedCell.col++;
                } else if (e.key === "ArrowLeft") {
                    if (this.spreadsheet.selectedCell.col > 0) {
                        this.spreadsheet.selectedCell.col--;
                    }
                }

                this.showEditor(
                    this.spreadsheet.selectedCell.row,
                    this.spreadsheet.selectedCell.col
                );
            }

            // Enter key can also commit the input
            else if (e.key === "Enter") {
                this.commitInput();
                if (!e.shiftKey) {
                    this.spreadsheet.selectedCell.row++;
                } else {
                    this.spreadsheet.selectedCell.row--;
                }

                this.showEditor(
                    this.spreadsheet.selectedCell.row,
                    this.spreadsheet.selectedCell.col
                );
            }
        });
    }

    /**
     * Show input field at specified row and column.
     */
    showEditor(row, col) {
        const config = this.spreadsheet.config;
        const rowHeights = this.spreadsheet.rowHeights;
        const colWidths = this.spreadsheet.colWidths;

        const rowSum = this.spreadsheet.sumHeight(0, row);
        const colSum = this.spreadsheet.sumWidths(0, col);

        const top = rowSum + config.colHeight;
        const left = colSum + config.rowWidth;

        this.inputField.style.top = `${top}px`;
        this.inputField.style.left = `${left}px`;
        this.inputField.style.height = `${rowHeights[row]}px`;
        this.inputField.style.width = `${colWidths[col]}px`;

        if (this.spreadsheet.gridData.hasData(row, col)) {
            this.inputField.value = this.spreadsheet.gridData.getCellValue(
                row,
                col
            );
        } else {
            this.inputField.value = "";
        }
        this.inputField.style.display = "block";

        this.currentCell = { row, col };

        this.spreadsheet.selectionManager.startCell = {
            row: this.spreadsheet.selectedCell.row,
            col: this.spreadsheet.selectedCell.col,
        };
        this.spreadsheet.selectionManager.endCell = {
            row: this.spreadsheet.selectedCell.row,
            col: this.spreadsheet.selectedCell.col,
        };

        this.spreadsheet.grid.draw(
            this.spreadsheet.currentStartRow,
            this.spreadsheet.currentStartCol
        );
        this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
        this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
        // Give a small delay before focusing
        setTimeout(() => {
            this.inputField.focus();
        }, 0); // 0ms delay to let rendering complete first
    }

    /**
     * Commit current input value to the data model.
     */
    commitInput() {
        const value = this.inputField.value;
        const { row, col } = this.currentCell || {};
        if (value === "") {
            this.spreadsheet.gridData.clearCell(row, col);
        } else {
            this.spreadsheet.gridData.setCellValue(row, col, value);
        }

        this.inputField.value = "";
    }

    hideInput() {
        this.inputField.style.display = "none";
        this.inputField.value = "";
        this.currentCell = {};
        this.spreadsheet.selectedCell = null;
        this.spreadsheet.isSelectingRange = false;
        this.spreadsheet.grid.draw(
            this.spreadsheet.currentStartRow,
            this.spreadsheet.currentStartCol
        );
        this.spreadsheet.colHeader.draw(this.spreadsheet.currentStartCol);
        this.spreadsheet.rowHeader.draw(this.spreadsheet.currentStartRow);
    }
}

export default CellEditor;
