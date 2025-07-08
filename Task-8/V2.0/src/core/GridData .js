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

    /**
    * Insert a new column at the specified index.
    * Shifts all cell data in columns >= colIndex to the right.
    * @param {number} colIndex - Index where the new column should be inserted.
    */
    insertColumn(colIndex) {
        const newData = new Map();

        for (const [key, value] of this.data.entries()) {
            const [row, col] = key.split(',').map(Number);

            if (col >= colIndex) {
                // Shift cell one column to the right
                const newKey = this._generateCellKey(row, col + 1);
                newData.set(newKey, value);
            } else {
                // Keep cell as-is
                newData.set(key, value);
            }
        }

        this.data = newData;
    }
    /**
     * Insert a new row at the specified index.
     * Shifts all cell data in rows >= rowIndex down by 1.
     * @param {number} rowIndex - Index where the new row should be inserted.
     */
    insertRow(rowIndex) {
        const newData = new Map();

        for (const [key, value] of this.data.entries()) {
            const [row, col] = key.split(',').map(Number);

            if (row >= rowIndex) {
                // Shift cell one row down
                const newKey = this._generateCellKey(row + 1, col);
                newData.set(newKey, value);
            } else {
                // Keep cell as-is
                newData.set(key, value);
            }
        }

        this.data = newData;
    }


    /**
     * Delete a column at the specified index.
     * Shifts all cell data in columns > colIndex to the left.
     * @param {number} colIndex - Index of the column to delete.
     * @returns {Array<{ row: number, col: number, value: any }>} The deleted column's data.
     */
    deleteColumn(colIndex) {
        const newData = new Map();
        const deletedColumnData = [];

        for (const [key, value] of this.data.entries()) {
            const [row, col] = key.split(',').map(Number);

            if (col === colIndex) {
                // Store the data to potentially restore later
                deletedColumnData.push({ row, col, value });
                // Don't copy this cell to newData
            } else if (col > colIndex) {
                // Shift left
                const newKey = this._generateCellKey(row, col - 1);
                newData.set(newKey, value);
            } else {
                // Keep as is
                newData.set(key, value);
            }
        }

        this.data = newData;
        return deletedColumnData;
    }

    /**
     * Delete a row at the specified index.
     * Shifts all cell data in rows > rowIndex up by 1.
     * @param {number} rowIndex - The index of the row to delete.
     * @returns {Array<{ row: number, col: number, value: any }>} - The data from the deleted row.
     */
    deleteRow(rowIndex) {
        const newData = new Map();
        const deletedRowData = [];

        for (const [key, value] of this.data.entries()) {
            const [row, col] = key.split(',').map(Number);

            if (row === rowIndex) {
                // Store cells from the deleted row
                deletedRowData.push({ row, col, value });
            } else if (row > rowIndex) {
                // Shift row upward
                const newKey = this._generateCellKey(row - 1, col);
                newData.set(newKey, value);
            } else {
                // Keep unchanged
                newData.set(key, value);
            }
        }

        this.data = newData;
        return deletedRowData;
    }


}

export default GridData;
