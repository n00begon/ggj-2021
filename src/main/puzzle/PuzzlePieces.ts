export class PuzzlePieces {
    public piece00: boolean;
    public piece10: boolean;
    public piece20: boolean;
    public piece01: boolean;
    public piece11: boolean;
    public piece21: boolean;
    public piece02: boolean;
    public piece12: boolean;
    public piece22: boolean;

    constructor() {
        this.piece00 = false;
        this.piece10 = false;
        this.piece20 = false;
        this.piece01 = false;
        this.piece11 = false;
        this.piece21 = false;
        this.piece02 = false;
        this.piece12 = false;
        this.piece22 = false;
    }

    public set(i: number, j: number): void {
        // HACK(Leon) : this sucks
        if (i == 0 && j == 0) {
            this.piece00 = true;
        } else if (i == 1 && j == 0) {
            this.piece10 = true;
        } else if (i == 2 && j == 0) {
            this.piece20 = true;
        } else if (i == 0 && j == 1) {
            this.piece01 = true;
        } else if (i == 1 && j == 1) {
            this.piece11 = true;
        } else if (i == 2 && j == 1) {
            this.piece21 = true;
        } else if (i == 0 && j == 2) {
            this.piece02 = true;
        } else if (i == 1 && j == 2) {
            this.piece12 = true;
        } else if (i == 2 && j == 2) {
            this.piece22 = true;
        }
    }

    public havePiece(i: number, j: number): boolean {
        // HACK(Leon) : this sucks
        if (i == 0 && j == 0) {
            return this.piece00;
        } else if (i == 1 && j == 0) {
            return this.piece10;
        } else if (i == 2 && j == 0) {
            return this.piece20;
        } else if (i == 0 && j == 1) {
            return this.piece01;
        } else if (i == 1 && j == 1) {
            return this.piece11;
        } else if (i == 2 && j == 1) {
            return this.piece21;
        } else if (i == 0 && j == 2) {
            return this.piece02;
        } else if (i == 1 && j == 2) {
            return this.piece12;
        } else if (i == 2 && j == 2) {
            return this.piece22;
        }

        return false;
    }
}
