import { GameSettings } from "../utilities/GameSettings";
import { MainEventsManager } from "./MainEventsManager";
import { PuzzlePieces, PuzzleHUD } from "./UIManager";

export class PuzzleMap {
    private pieces: PuzzlePieces;
    private puzzleHUD: PuzzleHUD;
    private showUI = false;
    constructor(scene: Phaser.Scene, x: number, y: number, player: number) {
        MainEventsManager.on("puzzle" + player, this.handleShowPuzzle, this);
        MainEventsManager.on("foundPuzzle" + player, this.handleFoundPuzzle, this);
        MainEventsManager.on("playerXY" + player, this.handlePlayerXY, this);
        this.pieces = new PuzzlePieces();
        this.puzzleHUD = new PuzzleHUD(scene, x, y);
        this.puzzleHUD.updateTreasurePos(GameSettings.XmarksTheSpot.x, GameSettings.XmarksTheSpot.y);
    }

    private handleShowPuzzle(): void {
        this.showUI = !this.showUI;
        if (this.showUI) {
            this.puzzleHUD.show(this.pieces);
        }
    }

    private handleFoundPuzzle(x: number, y: number): void {
        this.pieces.set(y, x);
    }

    private handlePlayerXY(x: number, y: number): void {
        this.puzzleHUD.updatePlayerPos(x, y);
    }
}
