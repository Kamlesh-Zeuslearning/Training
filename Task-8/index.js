function drawGrid(context) {
    //draw cells
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            context.rect(i * 60, 40 * j, 60, 40);
            context.fillText(`(${j},${i})`, i * 60 + 10, j * 40 + 10);
        }
    }
    context.stroke();
    // console.log("here", context)
}

document.addEventListener("mousedown", (e) => {
    let col = Math.trunc(e.offsetX / 40);
    let row = Math.trunc(e.offsetY / 40);
    console.log(e.clientX, " column: ", col, " ; ", e.clientY, " row: ", row);
});

function createCanvas(id, width, height) {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;

    const container = document.getElementById("container");
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    num++;
    drawGrid(ctx);
}

// Function to create multiple canvases
function createMultipleCanvases(numCanvases) {
    const width = 1800;
    const height = 1200;

    for (let i = 1; i <= numCanvases; i++) {
        createCanvas(`canvas_${i}`, width, height);
    }
    
}

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
callFunctionRepeatedly(50, 200);