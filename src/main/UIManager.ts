import { ScoreText } from "./ScoreText";
import { KeyControls } from "./KeyControls";
import { MainEventsManager } from "./MainEventsManager";
import { GameSettings } from "../utilities/GameSettings";

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

function build_rect(
    scene: Phaser.Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
): Phaser.GameObjects.Rectangle {
    const cx = x + w / 2.0;
    const cy = y + h / 2.0;

    return scene.add.rectangle(cx, cy, w, h, color);
}

export class PuzzleHUD {
    public x: number;
    public y: number;
    public rects: Phaser.GameObjects.Rectangle[][];
    public backgroundRect: Phaser.GameObjects.Rectangle;
    public playerPosRect: Phaser.GameObjects.Rectangle;
    static readonly TILE_WIDTH = 32;
    static readonly TILE_HEIGHT = 32;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.x = x;
        this.y = y;
        const colors = [0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00];

        this.backgroundRect = build_rect(
            scene,
            this.x,
            this.y,
            PuzzleHUD.TILE_WIDTH * 3,
            PuzzleHUD.TILE_HEIGHT * 3,
            0x000000,
        );

        this.rects = [];
        for (let i = 0; i < 3; i++) {
            this.rects[i] = [];
            for (let j = 0; j < 3; j++) {
                const ci = j * 3 + i;
                this.rects[i][j] = build_rect(
                    scene,
                    this.x + i * PuzzleHUD.TILE_WIDTH,
                    this.y + j * PuzzleHUD.TILE_HEIGHT,
                    PuzzleHUD.TILE_WIDTH,
                    PuzzleHUD.TILE_HEIGHT,
                    colors[ci],
                );
            }
        }

        this.playerPosRect = scene.add.rectangle(this.x + 32, this.y + 32, 8, 8, 0xff0000);
    }

    public updatePlayerPos(wx: number, wy: number): void {
        const x01 = wx / GameSettings.MAP_WIDTH;
        const y01 = wy / GameSettings.MAP_HEIGHT;
        let ux = x01 * 3 * PuzzleHUD.TILE_WIDTH;
        let uy = y01 * 3 * PuzzleHUD.TILE_HEIGHT;
        ux += this.x;
        uy += this.y;
        this.playerPosRect.setPosition(ux, uy);
    }

    public hide(): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.rects[j][i].visible = false;
            }
        }

        this.backgroundRect.visible = false;
        this.playerPosRect.visible = false;
    }

    public show(pieces: PuzzlePieces): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (pieces.havePiece(i, j)) {
                    this.rects[j][i].visible = true;
                }
            }
        }

        this.backgroundRect.visible = true;
        this.playerPosRect.visible = true;
    }
}

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private scoreTextWASD: ScoreText;
    private scoreTextArrows: ScoreText;

    private piecesWASD: PuzzlePieces;
    private puzzleHUDWASD: PuzzleHUD;

    private piecesArrows: PuzzlePieces;
    private puzzleHUDArrows: PuzzleHUD;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        MainEventsManager.on("scoreChange", this.handleScoreChange, this);

        MainEventsManager.on("foundPuzzle", this.foundPuzzle, this);

        MainEventsManager.on("playerXY", this.playerXY, this);

        this.scoreTextWASD = new ScoreText(scene, 30, 30);
        this.scoreTextWASD.update(0);
        this.scoreTextWASD.hide();

        this.scoreTextArrows = new ScoreText(scene, 800, 30);
        this.scoreTextArrows.update(0);
        this.scoreTextArrows.hide();

        this.piecesWASD = new PuzzlePieces();
        this.puzzleHUDWASD = new PuzzleHUD(scene, 64, 64);

        this.piecesArrows = new PuzzlePieces();
        this.puzzleHUDArrows = new PuzzleHUD(scene, 800, 64);

        this.piecesArrows.set(1, 1);
    }

    /**
     * Handles score change by updating the score UI text
     * @param amount - the amount the score is now
     */
    private handleScoreChange(amount: number): void {
        this.scoreTextWASD.update(amount);
    }

    public playerXY(control: KeyControls, x: number, y: number): void {
        if (control === KeyControls.WASD) {
            this.puzzleHUDWASD.updatePlayerPos(x, y);
        } else {
            this.puzzleHUDArrows.updatePlayerPos(x, y);
        }
    }

    public foundPuzzle(control: KeyControls, x: number, y: number): void {
        if (control === KeyControls.WASD) {
            this.piecesWASD.set(y, x);
        } else {
            this.piecesArrows.set(y, x);
        }
    }

    public showPuzzleForArrows(): void {
        //this.scoreTextArrows.update(200);
        this.puzzleHUDArrows.show(this.piecesArrows);
    }

    public hidePuzzleForArrows(): void {
        this.puzzleHUDArrows.hide();
        //this.scoreTextArrows.hide();
    }

    public showPuzzleForWASD(): void {
        //this.scoreTextWASD.update(100);
        this.puzzleHUDWASD.show(this.piecesWASD);
    }

    public hidePuzzleForWASD(): void {
        //this.scoreTextWASD.hide();
        this.puzzleHUDWASD.hide();
    }
}
