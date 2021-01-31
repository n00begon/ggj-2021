import { GameSettings } from "../../utilities/GameSettings";
import { BackgroundManager } from "../BackgroundManager";

export class PuzzleHUD {
    public x: number;
    public y: number;
    private treasureMap: Phaser.Tilemaps.Tilemap;
    constructor(scene: Phaser.Scene, x: number, y: number, player: number, background: BackgroundManager) {
        this.x = x;
        this.y = y;
        this.treasureMap = background.getTreasureMap(player);
        this.treasureMap.getLayer("treasureIsland").tilemapLayer.setPosition(x, y);
        this.treasureMap.getLayer("treasureObjects").tilemapLayer.setPosition(x, y);
        this.hide();
    }

    public hide(): void {
        const treasureMapSize = 5;
        for (let x = 0; x < treasureMapSize; x++) {
            for (let y = 0; y < treasureMapSize; y++) {
                const islandTile = this.treasureMap.getLayer("treasureIsland").tilemapLayer.getTileAt(x, y);
                if (islandTile) {
                    islandTile.setVisible(false);
                }
                const objectTile = this.treasureMap.getLayer("treasureObjects").tilemapLayer.getTileAt(x, y);
                if (objectTile) {
                    objectTile.setVisible(false);
                }
            }
        }
    }

    public show(): void {
        const treasureMapSize = 5;
        for (let x = 0; x < treasureMapSize; x++) {
            for (let y = 0; y < treasureMapSize; y++) {
                const islandTile = this.treasureMap.getLayer("treasureIsland").tilemapLayer.getTileAt(x, y);
                if (islandTile) {
                    islandTile.setVisible(true);
                }
                const objectTile = this.treasureMap.getLayer("treasureObjects").tilemapLayer.getTileAt(x, y);
                if (objectTile) {
                    objectTile.setVisible(true);
                }
            }
        }
    }
}
