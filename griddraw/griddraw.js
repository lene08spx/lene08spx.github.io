/*
    Grid Draw v1.0 (C) 2018 Oliver Lenehan
*/

const scale = 1;
const lineLen = 64*scale;
const gridXY = 13;
const gridLineWidth = 1;
const radius = 9;
const cursorRadius = radius*scale;
const lineWidth = 2*radius*scale;

let mousePos = {x:0,y:0};
let dotPos = {x:0,y:0};
let beginPos = {x:0,y:0};

let isMouseDown = false;
let wasEscaped = false;

let canvasWidth = (gridXY * lineLen) + gridLineWidth;
/** @type {HTMLCanvasElement} */
let photoCanvas = document.getElementById('photoLayer');
let photoCtx = photoCanvas.getContext('2d');
photoCanvas.width = canvasWidth;
photoCanvas.height = canvasWidth;
/** @type {HTMLCanvasElement} */
let gridCanvas = document.getElementById('gridLayer');
let gridCtx = gridCanvas.getContext('2d');
gridCanvas.width = canvasWidth;
gridCanvas.height = canvasWidth;

/** @type {HTMLCanvasElement} */
let paperCanvas = document.getElementById('paperLayer');
let paperCtx = paperCanvas.getContext('2d');
paperCanvas.width = canvasWidth;
paperCanvas.height = canvasWidth;
/** @type {HTMLCanvasElement} */
let previewCanvas = document.getElementById('previewLayer');
let previewCtx = previewCanvas.getContext('2d');
previewCanvas.width = canvasWidth;
previewCanvas.height = canvasWidth;

/** @type {HTMLCanvasElement} */
let cursorCanvas = document.getElementById('cursorLayer');
let cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = canvasWidth;
cursorCanvas.height = canvasWidth;

dotPos = {x:cursorCanvas.width/2,y:cursorCanvas.height/2};

document.getElementById("canvases").style.width = String(canvasWidth)+"px";
document.getElementById("canvases").style.height = String(canvasWidth)+"px";

photoCtx.fillStyle = "#FFF";
gridCtx.fillStyle = "#77C8FF";
paperCtx.fillStyle = "#000000";
paperCtx.lineCap = "round";
previewCtx.fillStyle = "#000000";
previewCtx.lineCap = "round";
cursorCtx.fillStyle = "#1587D8";

paperCtx.lineWidth = String(lineWidth);
previewCtx.lineWidth = String(lineWidth);

for (let i=0; i<gridXY+1; i++) {
    gridCtx.fillRect(i*lineLen,0, gridLineWidth,(gridXY * (lineLen)) + 1); // Vertical Lines
    gridCtx.fillRect(0,i*lineLen, (gridXY * (lineLen)) + 1,gridLineWidth); // Horizontal Lines
}

function drawCursor(){
    cursorCtx.clearRect(0,0,cursorCanvas.width,cursorCanvas.height);
    cursorCtx.beginPath();
    cursorCtx.arc(dotPos.x, dotPos.y, cursorRadius, 0, 2 * Math.PI, false);
    cursorCtx.fill();
    cursorCtx.closePath();
}

cursorCanvas.addEventListener("mousemove",function(e){
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    dotPos.x = mousePos.x + lineLen/4 - ((mousePos.x + lineLen/4) % (lineLen/2));
    dotPos.y = mousePos.y + lineLen/4 - ((mousePos.y + lineLen/4) % (lineLen/2));
    drawCursor();

    if (isMouseDown && !wasEscaped) {
        previewCtx.clearRect(0,0,previewCanvas.width,previewCanvas.height);
        previewCtx.beginPath();
        previewCtx.moveTo(beginPos.x,beginPos.y);
        previewCtx.lineTo(dotPos.x,dotPos.y);
        previewCtx.stroke();
    }
});
cursorCanvas.addEventListener("mousedown", function(e){
    paperCtx.beginPath();
    paperCtx.moveTo(dotPos.x,dotPos.y);

    beginPos.x = dotPos.x;
    beginPos.y = dotPos.y;
});
cursorCanvas.addEventListener("mouseup", function(e){
    if (!wasEscaped) {
        paperCtx.lineTo(dotPos.x,dotPos.y);
        //paperCtx.closePath();
        paperCtx.stroke();
    }

    photoCtx.fillRect(0,0,photoCanvas.width,photoCanvas.height);
    photoCtx.drawImage(paperCanvas,0,0);
    document.getElementById("save").href = photoCanvas.toDataURL();
    photoCtx.fillRect(0,0,photoCanvas.width,photoCanvas.height);
    photoCtx.drawImage(gridCanvas,0,0);
    photoCtx.drawImage(paperCanvas,0,0);
    document.getElementById("saveGrid").href = photoCanvas.toDataURL();
    photoCtx.clearRect(0,0,photoCanvas.width,photoCanvas.height);
});

window.addEventListener("mousedown",function(e){
    isMouseDown = true;
});
window.addEventListener("mouseup",function(e){
    isMouseDown = false;
    wasEscaped = false;
    previewCtx.clearRect(0,0,previewCanvas.width,previewCanvas.height);
});
window.addEventListener("keydown",function(e){
    if (e.key === "Escape") {
        wasEscaped = true;
        previewCtx.clearRect(0,0,previewCanvas.width,previewCanvas.height);
        paperCtx.closePath();
    }
});

drawCursor();
