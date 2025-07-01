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
        this.inputField.addEventListener("blur", () => {
            this.commitInput();
        });

        // Placeholder: Escape key cancels input
        this.inputField.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.inputField.style.display = "none";
            }
            // TODO: handle navigation here
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
        this.inputField.style.display = "block";

        this.inputField.focus();
        this.currentCell = { row, col };
    }

    /**
     * Commit current input value to the data model (or console for now).
     */
    commitInput() {
        const value = this.inputField.value;
        const { row, col } = this.currentCell || {};
        if (row != null && col != null) {
            console.log(`Saving value '${value}' to cell (${row}, ${col})`);
            // TODO: save to data model
        }
        // this.inputField.style.display = "none";
        this.inputField.value = "";
    }
}

export default CellEditor;