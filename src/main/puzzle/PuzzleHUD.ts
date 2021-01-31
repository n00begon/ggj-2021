import { GameSettings } from "../../utilities/GameSettings";
import { BackgroundManager } from "../BackgroundManager";

export class PuzzleHUD {
    public x: number;
    public y: number;

    constructor(scene: Phaser.Scene, x: number, y: number, player: number, background: BackgroundManager) {
        this.x = x;
        this.y = y;
        const treasureMap = background.getTreasureMap(player);
        treasureMap.getLayer("treasureIsland").tilemapLayer.setPosition(x, y);
    }

    public hide(): void {
        console.log("hide");
    }

    public show(): void {
        console.log("show");
    }
}
