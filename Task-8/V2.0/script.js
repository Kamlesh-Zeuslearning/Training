let cellWidth = 50;
let cellHeight = 20;

let canvasWidth = (cellWidth * 30);
let canvasHeight = (cellHeight * 30)+1;

function createCanvas(id, width, height) {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;

    const container = document.getElementById("container");
    container.appendChild(canvas);

    ctx = resizeCanvasForDPR(canvas, width, height);

    ctx.beginPath();
    ctx.lineWidth = 1;
    drawGrid(ctx);
}

// createCanvas("01", canvasWidth, canvasWidth);

// Function to create multiple canvases
function createMultipleCanvases(numCanvases) {
    const width = canvasWidth;
    const height = canvasHeight;

    for (let i = 1; i <= numCanvases; i++) {
        createCanvas(`canvas_${i}`, width, height);
    }
    
}

createMultipleCanvases(11)//FOR ~100000 ROWS; IN 1 canvas = 30 rows 

function drawGrid(ctx) {
    // draw col
    for (let i = 0; i <= 30; i++) {
        ctx.moveTo((i * cellWidth)+0.5, 0);
        ctx.lineTo((i * cellWidth)+0.5, cellHeight * 30);
    }

    for (let i = 0; i <= 30; i++) {
        ctx.moveTo(0, (i*cellHeight)+0.5);
        ctx.lineTo(canvasWidth, (i*cellHeight)+0.5);
    }
    // Draw the Path
    ctx.stroke();
}

function resizeCanvasForDPR(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;

    // Set canvas drawing buffer size (in physical pixels)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set canvas display size (in CSS pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale the context so drawings scale properly
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}




//print cell numbrin
document.addEventListener("mousedown", (e) => {
    let col = Math.trunc(e.offsetX / cellWidth);
    let row = Math.trunc(e.offsetY / cellHeight);
    console.log(e.clientX, " column: ", col, " ; ", e.clientY, " row: ", row);
});