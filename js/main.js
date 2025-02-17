const cellSize = 10,
      brushRadius = 2,
      simulationInterval = 100,
      fadeFactor = 0.95;
const asciiChars = "|_()/\\";
const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d");
let grid = [],
    gridCols = 0,
    gridRows = 0,
    lastSimTime = 0,
    isMouseDown = false;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gridCols = Math.floor(canvas.width / cellSize);
    gridRows = Math.floor(canvas.height / cellSize);
    initGrid();
}
window.addEventListener("resize", resize);
resize();

function initGrid() {
    grid = [];
    for (let y = 0; y < gridRows; y++) {
	let row = [];
	for (let x = 0; x < gridCols; x++) {
	    row.push({ alive: false, decay: 0, char: null });
	}
	grid.push(row);
    }
    const numPatches = Math.floor(Math.random() * 6) + 32;
    for (let p = 0; p < numPatches; p++) {
	const centerX = Math.floor(Math.random() * gridCols);
	const centerY = Math.floor(Math.random() * gridRows);
	for (let i = 0; i < 12; i++) {
	    const dx = Math.floor(Math.random() * 5) - 2;
	    const dy = Math.floor(Math.random() * 5) - 2;
	    const x = centerX + dx,
		  y = centerY + dy;
	    if (x >= 0 && x < gridCols && y >= 0 && y < gridRows) {
		grid[y][x] = {
		    alive: true,
		    decay: 1,
		    char: asciiChars[Math.floor(Math.random() * asciiChars.length)]
		};
	    }
	}
    }
}

function updateGrid() {
    let newGrid = [];
    for (let y = 0; y < gridRows; y++) {
	newGrid[y] = [];
	for (let x = 0; x < gridCols; x++) {
	    let aliveNeighbors = 0;
	    for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
		    if (dx === 0 && dy === 0) continue;
		    const nx = (x + dx + gridCols) % gridCols;
		    const ny = (y + dy + gridRows) % gridRows;
		    if (grid[ny][nx].alive) aliveNeighbors++;
		}
	    }
	    const cell = grid[y][x];
	    let newCell = { alive: false, decay: cell.decay, char: cell.char };
	    if (cell.alive) {
		if (aliveNeighbors === 2 || aliveNeighbors === 3) {
		    newCell.alive = true;
		    newCell.decay = 1;
		    newCell.char = cell.char || asciiChars[Math.floor(Math.random() * asciiChars.length)];
		} else {
		    newCell.alive = false;
		    newCell.decay = cell.decay * fadeFactor;
		}
	    } else {
		if (aliveNeighbors === 3) {
		    newCell.alive = true;
		    newCell.decay = 1;
		    newCell.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
		} else {
		    newCell.alive = false;
		    newCell.decay = cell.decay * fadeFactor;
		}
	    }
	    if (newCell.decay < 0.05) newCell.decay = 0;
	    newGrid[y][x] = newCell;
	}
    }
    grid = newGrid;
}

function drawGrid() {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = cellSize + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let y = 0; y < gridRows; y++) {
	for (let x = 0; x < gridCols; x++) {
	    const cell = grid[y][x];
	    if (cell.decay > 0 && cell.char) {
		ctx.fillStyle = `rgba(255, 255, 255, ${cell.decay})`;
		ctx.fillText(cell.char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
	    }
	}
    }
}

function paintAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left,
	  my = clientY - rect.top;
    const col = Math.floor(mx / cellSize),
	  row = Math.floor(my / cellSize);
    for (let j = -brushRadius; j <= brushRadius; j++) {
	for (let i = -brushRadius; i <= brushRadius; i++) {
	    const r = row + j,
		  c = col + i;
	    if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
		if (Math.sqrt(i * i + j * j) <= brushRadius) {
		    grid[r][c] = {
			alive: true,
			decay: 1,
			char: asciiChars[Math.floor(Math.random() * asciiChars.length)]
		    };
		}
	    }
	}
    }
}

canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    paintAt(e.clientX, e.clientY);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) paintAt(e.clientX, e.clientY);
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});

function simulateInitialEvolution() {
    const iterations = Math.floor(8000 / simulationInterval);
    for (let i = 0; i < iterations; i++) {
	updateGrid();
    }
}

function animate(timestamp) {
    if (!lastSimTime) lastSimTime = timestamp;
    if (timestamp - lastSimTime > simulationInterval) {
	updateGrid();
	lastSimTime = timestamp;
    }
    drawGrid();
    requestAnimationFrame(animate);
}

simulateInitialEvolution();
requestAnimationFrame(animate);
