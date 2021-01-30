import { ScoreText } from "./ScoreText";
import { MainEventsManager } from "./MainEventsManager";

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

export class PuzzleHUD {
    public x: number;
    public y: number;
    public rects: Phaser.GameObjects.Rectangle[][];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.x = x;
        this.y = y;
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffffff, 0x000000, 0xff0000, 0xffff00, 0x00ffff, 0xff00ff];

        this.rects = [];
        for (let i = 0; i < 3; i++) {
            this.rects[i] = [];
            for (let j = 0; j < 3; j++) {
                const w = 32;
                const h = 32;
                const ci = j * 3 + i;
                this.rects[i][j] = scene.add.rectangle(this.x + i * w, this.y + j * h, w, h, colors[ci]);
            }
        }
    }

    public hide(): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.rects[j][i].visible = false;
            }
        }
    }

    public show(pieces: PuzzlePieces): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (pieces.havePiece(i, j)) {
                    this.rects[j][i].visible = true;
                }
            }
        }
    }
}

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private scoreTextWASD: ScoreText;
    private scoreTextArrows: ScoreText;

    private piecesWASD: PuzzlePieces;
    private puzzleHUD: PuzzleHUD;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        MainEventsManager.on("scoreChange", this.handleScoreChange, this);

        MainEventsManager.on("foundPuzzle", this.foundPuzzle, this);

        this.scoreTextWASD = new ScoreText(scene, 30, 30);
        this.scoreTextWASD.update(0);

        this.scoreTextArrows = new ScoreText(scene, 800, 30);
        this.scoreTextArrows.update(0);

        this.piecesWASD = new PuzzlePieces();
        this.puzzleHUD = new PuzzleHUD(scene, 64, 64);
    }

    /**
     * Handles score change by updating the score UI text
     * @param amount - the amount the score is now
     */
    private handleScoreChange(amount: number): void {
        this.scoreTextWASD.update(amount);
    }

    public foundPuzzle(x: number, y: number): void {
        this.piecesWASD.set(y, x);
    }

    public showPuzzleForArrows(): void {
        this.scoreTextArrows.update(200);
    }

    public hidePuzzleForArrows(): void {
        this.scoreTextArrows.hide();
    }

    public showPuzzleForWASD(): void {
        this.scoreTextWASD.update(100);
        this.puzzleHUD.show(this.piecesWASD);
    }

    public hidePuzzleForWASD(): void {
        this.scoreTextWASD.hide();
        this.puzzleHUD.hide();
    }
}
