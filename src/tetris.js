// Tetris game
import { Piece } from "./piece.js";
import { Grid } from "./grid.js";
import { GRID_WIDTH, GRID_HEIGHT, PIECE_SIZE, TICK_INTERVAL } from "./constants.js";

// Global variables
const canvas = document.getElementById("tetris-canvas");
const ctx = canvas.getContext("2d");
var grid;
var piece;
var nextPiece;
var score = 0;
var tickTask;
var running = false;

// Setup the canvas and the grid, create the first piece
function setup() {
    grid = new Grid(GRID_WIDTH, GRID_HEIGHT);
    piece = new Piece();
    nextPiece = new Piece();
}

// Draw the grid and the piece
function draw() {
    canvas.width = GRID_WIDTH * PIECE_SIZE * 2;
    canvas.height = GRID_HEIGHT * PIECE_SIZE;

    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, GRID_WIDTH * PIECE_SIZE, GRID_HEIGHT * PIECE_SIZE);

    grid.draw(ctx);
    piece.draw(ctx);

    // Draw the score
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, GRID_WIDTH * 1.1 * PIECE_SIZE, PIECE_SIZE * 1);
    ctx.fillText("Next Piece: ", GRID_WIDTH * 1.1 * PIECE_SIZE, PIECE_SIZE * 2);

    // Draw the next piece
    nextPiece.x = GRID_WIDTH * 1.2 - 1;
    nextPiece.y = 3;
    nextPiece.draw(ctx);

    // Draw the border
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, GRID_WIDTH * PIECE_SIZE, GRID_HEIGHT * PIECE_SIZE);
    ctx.strokeRect(GRID_WIDTH * PIECE_SIZE, 0, GRID_WIDTH * PIECE_SIZE * 2, GRID_HEIGHT * PIECE_SIZE);

    // Draw the next piece border
    ctx.strokeRect(GRID_WIDTH * 1.1 * PIECE_SIZE, PIECE_SIZE * 3, PIECE_SIZE * 4, PIECE_SIZE * 4);

    if (!running) {
        ctx.font = "25px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, " + Math.abs(Math.sin(Date.now() / 1000)) + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Press space to start", GRID_WIDTH * 0.5 * PIECE_SIZE, PIECE_SIZE * 5);

        // Draw again in 10ms
        setTimeout(draw, 10);
    }
}

// Handle key presses
function keyPressed(key) {
    if (!running && key === " ") {
        running = true;
        tickTask = setInterval(tick, TICK_INTERVAL);
        draw();
        return true;
    } else if (!running) {
        return false;
    }

    if (key === " ") {
        grid.dropPiece(piece);
        mergePiece();
    } else if (key === "ArrowUp") {
        piece.rotate();
        if (grid.checkCollision(piece)) {
            piece.rotateBack();
        }
    } else if (key === "ArrowDown") {
        piece.moveDown();
        if (grid.checkCollision(piece)) {
            piece.moveUp();
        }
    } else if (key === "ArrowLeft") {
        piece.moveLeft();
        if (grid.checkCollision(piece)) {
            piece.moveRight();
        }
    } else if (key === "ArrowRight") {
        piece.moveRight();
        if (grid.checkCollision(piece)) {
            piece.moveLeft();
        }
    } else {
        return false;
    }

    draw();
    return true;
}

function tick() {
    if (!running) {
        return;
    }

    // Check if the game is over
    if (grid.checkCollision(piece)) {
        clearInterval(tickTask);
        tickTask = undefined;
        running = false;
        reset();
        return;
    }

    // Move the piece down
    piece.moveDown();
    if (grid.checkCollision(piece)) {
        piece.moveUp();
        mergePiece();
    }

    draw();
}

function mergePiece() {
    grid.merge(piece);

    nextPiece.x = GRID_WIDTH / 2 - 1;
    nextPiece.y = 0;

    piece = nextPiece;
    nextPiece = new Piece();

    // Clear full lines
    let clearedLines = grid.clearLines();
    score += clearedLines * clearedLines * 100;
}

function reset() {
    score = 0;
    grid.clear();
    piece = new Piece();
    nextPiece = new Piece();
    draw();
}

window.addEventListener("keydown", (e) => {
    if (keyPressed(e.key)) {
        e.preventDefault();
    }
});

window.onload = () => {
    setup();
    draw();
};

window.onclose = () => {
    clearInterval(tickTask);
};