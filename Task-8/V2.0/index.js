import Spreadsheet from "./src/spreadsheet.js";

//basic grid dimensions
const config = {
    cellWidth: 100,
    cellHeight: 30,
    totalRows: 100000,
    totalCols: 1000,
    visibleRows: 100,
    visibleCols: 35,
    rowWidth: 50,
    colHeight: 30 ,  
};


const spreadsheet = new Spreadsheet(config);
