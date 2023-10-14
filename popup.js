// Define your constants and variables
const textModeContainer = document.getElementById('textMode');
const drawModeContainer = document.getElementById('drawMode');
const noteTextarea = document.getElementById('noteTextarea');
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

let isDrawing = false;
let isDrawingButton = false;
let lastX = 0;
let lastY = 0;
let penColor = '#000000';
let penWidth = 5;
let backgroundColor = '#ffffff'; // Default background color is white

function saveDrawing() {
  localStorage.setItem('drawing', canvas.toDataURL());
}

function loadDrawing() {
  const savedData = localStorage.getItem('drawing');
  if (savedData) {
    const img = new Image();
    img.src = savedData;
    img.onload = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function draw(e) {
  if (!isDrawing || !isDrawingButton) return;
  ctx.strokeStyle = penColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = penWidth;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
  saveDrawing();
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  saveDrawing();
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
  saveDrawing();
});

const penWidthRange = document.getElementById('penWidthRange');
penWidthRange.addEventListener('input', (e) => {
  penWidth = e.target.value;
});

const penColorPicker = document.getElementById('penColorPicker');
penColorPicker.addEventListener('input', (e) => {
  penColor = e.target.value;
});

const clearCanvasButton = document.getElementById('clearCanvasButton');
clearCanvasButton.addEventListener('click', () => {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem('drawing');
});

const switchToDrawButton = document.getElementById('switchToDraw');
switchToDrawButton.addEventListener('click', () => {
  isDrawingButton = true;
  textModeContainer.style.display = 'none';
  drawModeContainer.style.display = 'block';
  loadDrawing();
});

const switchToTextButton = document.getElementById('switchToText');
switchToTextButton.addEventListener('click', () => {
  isDrawingButton = false;
  drawModeContainer.style.display = 'none';
  textModeContainer.style.display = 'block';
  saveDrawing();
  loadNoteText();
});

noteTextarea.addEventListener('blur', () => {
  localStorage.setItem('noteText', noteTextarea.value);
});

const downloadTextButton = document.getElementById('downloadTextButton');
downloadTextButton.addEventListener('click', () => {
  const noteText = noteTextarea.value;
  const blob = new Blob([noteText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MyNote.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

const downloadCanvasButton = document.getElementById('downloadCanvasButton');
downloadCanvasButton.addEventListener('click', () => {
  const canvasImage = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = canvasImage;
  a.download = 'MyDrawing.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Function to load note text
function loadNoteText() {
  const savedNoteText = localStorage.getItem('noteText');
  if (savedNoteText) {
    noteTextarea.value = savedNoteText;
  }
}


canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  if (isDrawingButton) {
    // Show the pen radius overlay
    penRadiusOverlay.style.display = 'block';
    const halfWidth = penWidth / 2; // Half the width of the overlay (radius)
    penRadiusOverlay.style.width = `${2 * halfWidth}px`;
    penRadiusOverlay.style.height = `${2 * halfWidth}px`;
    penRadiusOverlay.style.left = `${x - halfWidth}px`;
    penRadiusOverlay.style.top = `${y - halfWidth}px`;
  } else {
    penRadiusOverlay.style.display = 'none';
  }

  draw(e);
});

canvas.addEventListener('mouseout', () => {
  penRadiusOverlay.style.display = 'none';
});


penColorPicker.addEventListener('input', (e) => {
  // Get the selected color from the input element
  const selectedColor = e.target.value;

  // Set the background color of the penRadiusOverlay to the selected color
  penRadiusOverlay.style.backgroundColor = selectedColor;
});

// Set the initial background color based on the default color
penRadiusOverlay.style.backgroundColor = penColorPicker.value;



loadDrawing();
loadNoteText();
