import { GameSettings } from "../../utilities/GameSettings";
import { MainEventsManager } from "../MainEventsManager";
import { PuzzleHUD } from "./PuzzleHUD";
import { PuzzlePieces } from "./PuzzlePieces";
export class PuzzleMap {
    private static readonly SHOWTIME = 20;
    private pieces: PuzzlePieces;
    private puzzleHUD: PuzzleHUD;
    private showUI = false;
    private showtime = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, player: number) {
        MainEventsManager.on("puzzle" + player, this.handleShowPuzzle, this);
        MainEventsManager.on("foundPuzzle" + player, this.handleFoundPuzzle, this);
        MainEventsManager.on("playerXY" + player, this.handlePlayerXY, this);
        this.pieces = new PuzzlePieces();
        this.puzzleHUD = new PuzzleHUD(scene, x, y);
        this.puzzleHUD.updateTreasurePos(GameSettings.XmarksTheSpot.x, GameSettings.XmarksTheSpot.y);
        this.puzzleHUD.hide();
    }

    private handleShowPuzzle(): void {
        if (this.showtime >= PuzzleMap.SHOWTIME) {
            this.showUI = !this.showUI;
            this.showtime = 0;
        }
        if (this.showUI) {
            this.puzzleHUD.show(this.pieces);
        } else {
            this.puzzleHUD.hide();
        }
    }

    private handleFoundPuzzle(x: number, y: number): void {
        this.pieces.set(y, x);
    }

    private handlePlayerXY(x: number, y: number): void {
        this.puzzleHUD.updatePlayerPos(x, y);
        this.showtime++;
    }
}
