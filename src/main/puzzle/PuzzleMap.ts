import { BackgroundManager } from "../BackgroundManager";
import { MainEventsManager } from "../MainEventsManager";
import { PuzzleHUD } from "./PuzzleHUD";
export class PuzzleMap {
    private static readonly SHOWTIME = 20;
    private puzzleHUD: PuzzleHUD;
    private showUI = false;
    private showtime = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, player: number, background: BackgroundManager) {
        MainEventsManager.on("puzzle" + player, this.handleShowPuzzle, this);
        MainEventsManager.on("foundPuzzle" + player, this.handleFoundPuzzle, this);
        MainEventsManager.on("playerXY" + player, this.handlePlayerXY, this);
        this.puzzleHUD = new PuzzleHUD(scene, x, y, player, background);
        this.puzzleHUD.hide();
    }

    private handleShowPuzzle(): void {
        if (this.showtime >= PuzzleMap.SHOWTIME) {
            this.showUI = !this.showUI;
            this.showtime = 0;
        }
        if (this.showUI) {
            this.puzzleHUD.show();
        } else {
            this.puzzleHUD.hide();
        }
    }

    private handleFoundPuzzle(x: number, y: number): void {
        console.log("Found piece");
        this.puzzleHUD.foundPiece();
    }

    private handlePlayerXY(x: number, y: number): void {
        this.showtime++;
    }
}
