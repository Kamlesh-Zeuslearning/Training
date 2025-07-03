class GridData {
    constructor() {
        this.data = new Map(); // Store cell data with row,col as key (row,col -> value)
    }

    /**
     * Generate a unique key for the cell using its row and column indices
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {string} The key in the format "row,col"
     */
    _generateCellKey(row, col) {
        return `${row},${col}`;
    }

    /**
     * Set the value of a specific cell.
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {any} value - The value to set for the cell
     */
    setCellValue(row, col, value) {
        const key = this._generateCellKey(row, col);
        this.data.set(key, value);
    }

    /**
     * Get the value of a specific cell.
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {any} The value of the cell, or null if not set
     */
    getCellValue(row, col) {
        const key = this._generateCellKey(row, col);
        return this.data.get(key) || null; // Return null if not set
    }

    /**
     * Clear the value of a specific cell.
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    clearCell(row, col) {
        const key = this._generateCellKey(row, col);
        this.data.delete(key); // Remove the data
    }

    /**
     * Check if a cell has data
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} True if cell has data, false otherwise
     */
    hasData(row, col) {
        const key = this._generateCellKey(row, col);
        return this.data.has(key);
    }

    /**
     * Get all non-empty cell values in a given range of rows and columns
     * @param {number} startRow - Starting row index
     * @param {number} startCol - Starting column index
     * @param {number} visibleRows - Number of rows to check
     * @param {number} visibleCols - Number of columns to check
     * @returns {Array} List of {row, col, value} for non-empty cells
     */
    getNonEmptyCells(startRow, startCol, visibleRows, visibleCols) {
        const nonEmptyCells = [];
        for (let row = startRow; row < startRow + visibleRows; row++) {
            for (let col = startCol; col < startCol + visibleCols; col++) {
                const value = this.getCellValue(row, col);
                if (value !== null) {
                    nonEmptyCells.push({ row, col, value });
                }
            }
        }
        return nonEmptyCells;
    }
}

export default GridData;
