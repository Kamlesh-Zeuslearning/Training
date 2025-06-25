// Configuration
const cellWidth = 50;
const cellHeight = 20;

const totalRows = 100000;
const totalCols = 1000;

const visibleRows = 40;
const visibleCols = 35;

const canvasWidth = cellWidth * visibleCols;
const canvasHeight = cellHeight * visibleRows;

// Create canvas
function setupCanvas() {
    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    document.getElementById("container").appendChild(canvas);
    return { canvas, ctx };
}

const { canvas, ctx } = setupCanvas();
const scrollContainer = document.getElementById("scrollContainer");

// Draw grid for visible rows
function drawVisibleGrid(startRow, startCol) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw horizontal lines
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    for (let r = 0; r <= visibleRows; r++) {
        const y = r * cellHeight;
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(canvasWidth, y + 0.5);
    }

    // Draw vertical lines
    for (let c = 0; c <= visibleCols; c++) {
        const x = c * cellWidth;
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, canvasHeight);
    }
    ctx.stroke();

    // Draw text content
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";

    for (let r = 0; r < visibleRows; r++) {
        const rowIndex = startRow + r;
        //   if (rowIndex >= totalRows) break;

        for (let c = 0; c < visibleCols; c++) {
            const colIndex = startCol + c;
            if (colIndex >= totalCols) break;

            const text = `R${rowIndex}C${colIndex}`;
            ctx.fillText(text, c * cellWidth + 5, r * cellHeight + 15);
        }
    }
}

const topLeft = document.getElementById("topLeft");

// Scroll handler
scrollContainer.addEventListener("scroll", () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollLeft = scrollContainer.scrollLeft;

    if (scrollLeft >= 50000) {
        return;
    }
    // console.log(scrollLeft);

    const startRow = Math.floor(scrollTop / cellHeight);
    const startCol = Math.floor(scrollLeft / cellWidth);

    //calculation for position of canvas while scrolling
    const canvasTop = startRow * cellHeight;
    const canvasLeft = startCol * cellWidth;

    canvas.style.top = `${canvasTop + 20}px`; //for setting positon for canvas as it is absolute
    canvas.style.left = `${canvasLeft + 50}px`;

    drawVisibleGrid(startRow, startCol);

    //setting position of rowHeader
    rowCanvas.style.top = `${canvasTop + cellHeight}px`;
    rowCanvas.style.left = `${scrollLeft}px`;

    drawRowHeader(startRow);

    //setting position of colHeader
    colCanvas.style.top = `${scrollTop}px`;
    colCanvas.style.left = `${canvasLeft + cellWidth}px`;
    drawColHeader(startCol);

    //setting position for topLeft
    topLeft.style.top = `${scrollTop}px`;
    topLeft.style.left = `${scrollLeft}px`;
});

// Initial render
drawVisibleGrid(0, 0);

/* -------   row header ----------*/

function setupRowHeader() {
    const rowCanvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    rowCanvas.width = 50 * dpr;
    rowCanvas.height = 20 * visibleRows * dpr;

    rowCanvas.style.width = 50 + "px";
    rowCanvas.style.height = 20 * visibleRows + "px";

    const ctxRow = rowCanvas.getContext("2d");
    ctxRow.scale(dpr, dpr);

    document.getElementById("rowHeader").appendChild(rowCanvas);

    return { rowCanvas, ctxRow };
}

// setupRowHeader()

const { rowCanvas, ctxRow } = setupRowHeader();
drawRowHeader(0);

function drawRowHeader(startRow) {
    ctxRow.clearRect(0, 0, 50, canvasHeight);
    ctxRow.beginPath();
    ctxRow.strokeStyle = "#ccc";

    //draw horizontal lines
    for (let r = 0; r < visibleRows; r++) {
        const y = r * cellHeight;
        ctxRow.moveTo(0, y + 0.5);
        ctxRow.lineTo(50, y + 0.5);
    }

    ctxRow.moveTo(cellWidth - 0.5, 0);
    ctxRow.lineTo(cellWidth - 0.5, canvasHeight);
    ctxRow.stroke();

    for (let r = 0; r < visibleRows; r++) {
        const rowIndex = startRow + r;
        ctxRow.textAlign = "end";
        ctxRow.fillText(rowIndex, cellWidth - 5, r * cellHeight + 15);
    }
}

/* -------   col header ----------*/

const { colCanvas, ctxCol } = setupColHeader();
drawColHeader(0);

function setupColHeader() {
    const colCanvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    colCanvas.width = cellWidth * visibleCols * dpr;
    colCanvas.height = cellHeight * dpr;

    colCanvas.style.width = cellWidth * visibleCols + "px";
    colCanvas.style.height = cellHeight + "px";

    const ctxCol = colCanvas.getContext("2d");
    ctxCol.scale(dpr, dpr);

    document.getElementById("colHeader").appendChild(colCanvas);

    return { colCanvas, ctxCol };
}

function drawColHeader(startCol) {
    ctxCol.clearRect(0, 0, 50 * visibleCols, 20);
    ctxCol.beginPath();
    ctxCol.strokeStyle = "#ccc";

    //draw vertical lines
    for (let c = 0; c < visibleCols; c++) {
        const x = c * cellWidth;
        ctxCol.moveTo(x + 0.5, 0);
        ctxCol.lineTo(x + 0.5, cellHeight);
    }

    ctxCol.moveTo(0, cellHeight - 0.5);
    ctxCol.lineTo(cellWidth * visibleCols, cellHeight - 0.5);
    ctxCol.stroke();

    //draw text content
    ctxCol.font = "12px Arial";
    ctxCol.fillStyle = "#000";
    for (let c = 0; c < visibleCols; c++) {
        const colIndex = startCol + c;
        ctxCol.textAlign = "center";
        ctxCol.fillText(colIndex, c * cellWidth + cellWidth / 2, 15);
    }
}

