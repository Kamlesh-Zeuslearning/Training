let cellWidth = 50;
let cellHeight = 20;

let canvasWidth = cellWidth*30
let canvasHeight = (cellHeight*30)  

function drawGrid(context) {
    //draw cells
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            context.lineWidth = 1;
            context.rect((i * cellWidth)+0.5, (cellHeight * j)+0.5, cellWidth, cellHeight);
            context.fillText(`(${j},${i})`, i * cellWidth + 10, j * cellHeight + 10);
        }
    }
    context.stroke();
    // console.log("here", context)
}

document.addEventListener("mousedown", (e) => {
    let col = Math.trunc(e.offsetX / cellWidth);
    let row = Math.trunc(e.offsetY / cellHeight);
    console.log(e.clientX, " column: ", col, " ; ", e.clientY, " row: ", row);
});

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
    // num++;
    drawGrid(ctx);
}



// Function to create multiple canvases
function createMultipleCanvases(numCanvases) {
    const width = canvasWidth;
    const height = canvasHeight;

    for (let i = 1; i <= numCanvases; i++) {
        createCanvas(`canvas_${i}`, width, height);
    }
    
}

createMultipleCanvases(11)//FOR ~100000 ROWS; IN 1 canvas = 30 rows 

let num = 0;
function callFunctionRepeatedly(count, delay) {
  let counter = 1;

  function callNext() {
    if (counter <= count) {
      createMultipleCanvases(10)
      counter++;
      setTimeout(callNext, delay);
    }
    console.log(num)
  }

  callNext();
}

// Call function x times with y delay
// callFunctionRepeatedly(50, 200);



function resizeCanvasForDPR(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;

  // Set canvas drawing buffer size (in physical pixels)
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // Set canvas display size (in CSS pixels)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale the context so drawings scale properly
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return ctx;
}
