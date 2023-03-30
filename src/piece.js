// Tetris piece class
import { PIECE_TYPES, PIECE_COLORS, GRID_WIDTH } from './constants.js';
import { drawBlock } from './grid.js';

export class Piece {

    constructor(type = undefined, color = undefined) {
        this.type = type === undefined ? Math.floor(Math.random() * PIECE_TYPES.length) : type;
        this.color = color === undefined ? PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)] : color;
        this.rotation = 0;
        this.x = GRID_WIDTH / 2 - 1;
        this.y = 0;
    }

    /**
     * Returns the shape of the piece in its current rotation.
     * 
     * @returns {number} 16-bit number representing the shape of the piece in its current rotation.
     */
    getShape() {
        return PIECE_TYPES[this.type][this.rotation];
    }

    rotate() {
        this.rotation = (this.rotation + 1) % 4;
    }

    rotateBack() {
        this.rotation = (this.rotation + 3) % 4;
    }

    draw(ctx) {
        let shape = this.getShape();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (shape & 0x8000) {
                    drawBlock(ctx, this.x + j, this.y + i, this.color);
                }
                shape <<= 1;
            }
        }
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    moveDown() {
        this.y++;
    }

    moveUp() {
        this.y--;
    }

}