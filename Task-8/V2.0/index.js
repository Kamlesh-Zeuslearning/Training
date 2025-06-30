import Spreadsheet from "./spreadsheet.js";

//basic grid dimensions
const config = {
    cellWidth: 70,
    cellHeight: 30,
    totalRows: 100000,
    totalCols: 1000,
    visibleRows: 40,
    visibleCols: 35,
};


const spreadsheet = new Spreadsheet(config);
