// Tetris grid class
import { PIECE_SIZE } from "./constants.js";
import { Piece } from "./piece.js";

export class Grid {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
    }

    createGrid() {
        const grid = [];
        for (let i = 0; i < this.height; i++) {
            grid.push(new Array(this.width).fill(0));
        }
        return grid;
    }

    clear() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.grid[i][j] !== 0) {
                    drawBlock(ctx, j, i, this.grid[i][j]);
                }
            }
        }
    }

    /**
     * Check if piece collides with grid.
     * 
     * @param {Piece} piece Piece to check collision for.
     * @returns True if piece collides with grid, false otherwise.
     */
    checkCollision(piece) {
        var shape = piece.getShape();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (shape & 0x8000) {
                    if (piece.y + i >= this.height || piece.x + j < 0 || piece.x + j >= this.width || this.grid[piece.y + i][piece.x + j] !== 0) {
                        return true;
                    }
                }
                shape <<= 1;
            }
        }
        return false;
    }

    merge(piece) {
        var shape = piece.getShape();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (shape & 0x8000 && piece.y + i >= 0) {
                    this.grid[piece.y + i][piece.x + j] = piece.color;
                }
                shape <<= 1;
            }
        }
    }

    clearLines() {
        let lines = 0;
        for (let i = this.height - 1; i >= 0; i--) {
            let filled = true;
            for (let j = 0; j < this.width; j++) {
                if (this.grid[i][j] === 0) {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                lines++;
                for (let k = i; k > 0; k--) {
                    for (let j = 0; j < this.width; j++) {
                        this.grid[k][j] = this.grid[k - 1][j];
                    }
                }
                for (let j = 0; j < this.width; j++) {
                    this.grid[0][j] = 0;
                }
                i++;
            }
        }
        return lines;
    }

    dropPiece(piece) {
        while (!this.checkCollision(piece)) {
            piece.y++;
        }
        piece.y--;
    }

}

export function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
    ctx.strokeStyle = "black";

    // Draw the block
    ctx.fillRect(x * PIECE_SIZE, y * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    ctx.strokeRect(x * PIECE_SIZE, y * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);

    // Draw the shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(x * PIECE_SIZE, y * PIECE_SIZE + PIECE_SIZE / 2, PIECE_SIZE, PIECE_SIZE / 2);
    
    // Draw the outline
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.strokeRect(x * PIECE_SIZE, y * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);

    // Draw the inner outline
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.strokeRect(x * PIECE_SIZE + 1, y * PIECE_SIZE + 1, PIECE_SIZE - 2, PIECE_SIZE - 2);

    // Draw the inner shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(x * PIECE_SIZE + 1, y * PIECE_SIZE + PIECE_SIZE / 2 + 1, PIECE_SIZE - 2, PIECE_SIZE / 2 - 2);

    // Draw the inner highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(x * PIECE_SIZE + 1, y * PIECE_SIZE + 1, PIECE_SIZE - 2, PIECE_SIZE / 2 - 2);

    // Draw the highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(x * PIECE_SIZE, y * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE / 2);
}