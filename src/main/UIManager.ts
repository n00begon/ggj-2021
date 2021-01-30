import { ScoreText } from "./ScoreText";
import { MainEventsManager } from "./MainEventsManager";

export class PuzzlePieces {
    public leftTop: boolean;
    public centerTop: boolean;
    public rightTop: boolean;
    public leftCenter: boolean;
    public center: boolean;
    public rightCenter: boolean;
    public leftBottom: boolean;
    public centerBottom: boolean;
    public rightBottom: boolean;

    constructor() {
        this.leftTop = false;
        this.centerTop = false;
        this.rightTop = false;
        this.leftCenter = false;
        this.center = false;
        this.rightCenter = false;
        this.leftBottom = false;
        this.centerBottom = false;
        this.rightBottom = false;
    }

    public havePiece(i: number, j: number): boolean {
        // HACK(Leon) : this sucks
        if (i == 0 && j == 0) {
            return this.leftTop;
        } else if (i == 1 && j == 0) {
            return this.centerTop;
        } else if (i == 2 && j == 0) {
            return this.rightTop;
        } else if (i == 0 && j == 1) {
            return this.leftCenter;
        } else if (i == 1 && j == 1) {
            return this.center;
        } else if (i == 2 && j == 1) {
            return this.rightCenter;
        } else if (i == 0 && j == 2) {
            return this.leftBottom;
        } else if (i == 1 && j == 2) {
            return this.centerBottom;
        } else if (i == 2 && j == 2) {
            return this.rightBottom;
        }

        return false;
    }
}

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private scoreTextWASD: ScoreText;
    private scoreTextArrows: ScoreText;

    private piecesWASD: PuzzlePieces;
    private rects: Phaser.GameObjects.Rectangle[][];

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        MainEventsManager.on("scoreChange", this.handleScoreChange, this);
        MainEventsManager.on("foundPuzzleLT", this.foundPuzzleLT, this);
        MainEventsManager.on("foundPuzzleLC", this.foundPuzzleLC, this);

        this.scoreTextWASD = new ScoreText(scene, 30, 30);
        this.scoreTextWASD.update(0);

        this.scoreTextArrows = new ScoreText(scene, 800, 30);
        this.scoreTextArrows.update(0);

        this.piecesWASD = new PuzzlePieces();

        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffffff, 0x000000, 0xff0000, 0x00ff00, 0x0000ff, 0xffffff];

        this.rects = [];
        for (let i = 0; i < 3; i++) {
            this.rects[i] = [];
            for (let j = 0; j < 3; j++) {
                const w = 32;
                const h = 32;
                this.rects[i][j] = scene.add.rectangle(i * w, j * h, w, h, colors[i]);
            }
        }
    }

    /**
     * Handles score change by updating the score UI text
     * @param amount - the amount the score is now
     */
    private handleScoreChange(amount: number): void {
        this.scoreTextWASD.update(amount);
    }

    private foundPuzzleLT(): void {
        this.piecesWASD.leftTop = true;
    }

    private foundPuzzleLC(): void {
        this.piecesWASD.center = true;
    }

    public showPuzzleForArrows(): void {
        this.scoreTextArrows.update(200);
    }

    public hidePuzzleForArrows(): void {
        this.scoreTextArrows.hide();
    }

    public showPuzzleForWASD(): void {
        this.scoreTextWASD.update(100);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.piecesWASD.havePiece(i, j)) {
                    this.rects[j][i].visible = true;
                }
            }
        }
    }

    public hidePuzzleForWASD(): void {
        this.scoreTextWASD.hide();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.rects[j][i].visible = false;
            }
        }
    }
}
