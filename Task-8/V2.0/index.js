import Spreadsheet from "./src/core/Spreadsheet.js";

//basic grid dimensions
const config = {
    cellWidth: 100,
    cellHeight: 30,
    totalRows: 100000,
    totalCols: 1000,
    visibleRows: 35,
    visibleCols: 25,
    rowWidth: 50,
    colHeight: 30,
    topPadding: 50,  
};


const spreadsheet = new Spreadsheet(config);

document.getElementById('loadFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();

    try {
        // Parse the JSON data
        const data = JSON.parse(text);

        // Ensure the data is in the correct format (array of objects)
        if (!Array.isArray(data)) {
            throw new Error("Invalid file format");
        }

        // Assuming the first object has the field names (header)
        const headers = Object.keys(data[0]);
        
        // Populate column headers
        headers.forEach((header, colIndex) => {
            spreadsheet.gridData.setCellValue(0, colIndex, header);  // Set headers in row 0
        });

        // Populate data
        data.forEach((rowData, rowIndex) => {
            headers.forEach((header, colIndex) => {
                spreadsheet.gridData.setCellValue(rowIndex + 1, colIndex, rowData[header]);
            });
        });

        // Re-render grid with loaded data
        spreadsheet.grid.draw(spreadsheet.currentStartRow, spreadsheet.currentStartCol);
        spreadsheet.rowHeader.draw(spreadsheet.currentStartRow);
        spreadsheet.colHeader.draw(spreadsheet.currentStartCol);
        
    } catch (err) {
        alert("Failed to load file: " + err.message);
        console.error(err);
    }
});

document.getElementById('sumBtn').addEventListener('click', () => {
    const range = spreadsheet.selectionManager.getSelectedRange();
    let sum = 0;
    for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
            const val = spreadsheet.gridData.getCellValue(r, c);
            const num = parseFloat(val);
            if (!isNaN(num)) sum += num;
        }
    }
    alert(`Sum: ${sum}`);
});

document.getElementById('minBtn').addEventListener('click', () => {
    const range = spreadsheet.selectionManager.getSelectedRange();
    let min = Infinity;
    for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
            const val = spreadsheet.gridData.getCellValue(r, c);
            const num = parseFloat(val);
            if (!isNaN(num)) min = Math.min(min, num);
        }
    }
    alert(`Min: ${min === Infinity ? 'N/A' : min}`);
});

document.getElementById('maxBtn').addEventListener('click', () => {
    const range = spreadsheet.selectionManager.getSelectedRange();
    let max = -Infinity;
    for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
            const val = spreadsheet.gridData.getCellValue(r, c);
            const num = parseFloat(val);
            if (!isNaN(num)) max = Math.max(max, num);
        }
    }
    alert(`Max: ${max === -Infinity ? 'N/A' : max}`);
});

document.getElementById('countBtn').addEventListener('click', () => {
    const range = spreadsheet.selectionManager.getSelectedRange();
    let cnt = 0;
    for(let r=range.startRow; r <= range.endRow; r++){
        for(let c=range.startCol; c <= range.endCol; c++){
            if(spreadsheet.gridData.hasData(r,c)){
                cnt++;
            }
        }
    }
    alert(cnt)
})

document.getElementById('avgBtn').addEventListener('click', ()=>{
    const range = spreadsheet.selectionManager.getSelectedRange();
    let sum = 0;
    let cnt = 0;
    for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
            const val = spreadsheet.gridData.getCellValue(r, c);
            const num = parseFloat(val);
            if (!isNaN(num)) sum += num;
            if(num !== null){
                cnt++;
            }
        }
    }

    alert(`Avg : ${sum/cnt}`)
})