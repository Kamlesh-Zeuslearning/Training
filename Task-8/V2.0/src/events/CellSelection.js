class CellSelection {
    constructor(grid) {
        this.spreadsheet = grid.spreadsheet;
        this.isSelecting = false;
        // this.attachEvents(this. );
    }

    attachEvents(canvas) {
        window.addEventListener("pointerdown", (e) => this.handleMouseDown(e));
        window.addEventListener("pointerup", () => this.handleMouseUp());
        window.addEventListener("pointermove", (e) => this.handleMouseMove(e));
    }

    hitTest(e){
        if(e.clientX > 50 || e.clientY > 80){
            console.log("grid")
        }
    }

    handleMouseDown(e) {
        if(e.clientX < 50 || e.clientY < 80){
            return;
        }
        this.isSelecting = true;
        
        this.spreadsheet.selectedRow = null; 
        this.spreadsheet.selectedColumn = null;
        
        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(e,"grid");
        this.spreadsheet.selectionManager.startCell = cell;
        this.spreadsheet.selectionManager.endCell = cell;

        this.spreadsheet.selectedCell = { row: cell.row, col: cell.col }; 
        this.spreadsheet.cellEditor.showEditor(cell.row, cell.col);

    }

    handleMouseMove(e) {
        if (!this.isSelecting) return;
        const cell = this.spreadsheet.selectionManager.getCellFromMouseEvent(e,"grid");
        this.spreadsheet.selectionManager.endCell = cell;
        this.spreadsheet.render()
    }

    handleMouseUp() {
        this.isSelecting = false;        
    }
}

export default CellSelection;