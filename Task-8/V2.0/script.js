// Configuration
const cellWidth = 50;
const cellHeight = 20;

const totalRows = 100000;
const totalCols = 1000;

const visibleRows = 30;
const visibleCols = 30;

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

// Scroll handler
scrollContainer.addEventListener("scroll", () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollLeft = scrollContainer.scrollLeft;
    
    if(scrollLeft >= 50000){
        return
    }
    console.log(scrollLeft);

    const startRow = Math.floor(scrollTop / cellHeight);
    const startCol = Math.floor(scrollLeft / cellWidth);

    //calculation for position of canvas while scrolling
    const canvasTop = startRow * cellHeight;
    const canvasLeft = startCol * cellWidth;

    canvas.style.top = `${canvasTop}px`; //for setting positon for canvas as it is absolute
    canvas.style.left = `${canvasLeft}px`;

    drawVisibleGrid(startRow, startCol);
});

// Initial render
drawVisibleGrid(0, 0);
