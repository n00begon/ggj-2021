import { GameSettings } from "../../utilities/GameSettings";
import { BackgroundManager } from "../BackgroundManager";

export class PuzzleHUD {
    public x: number;
    public y: number;
    private treasureMap: Phaser.Tilemaps.Tilemap;
    private visibility: boolean[][] = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ];
    constructor(scene: Phaser.Scene, x: number, y: number, player: number, background: BackgroundManager) {
        this.x = x;
        this.y = y;
        this.treasureMap = background.getTreasureMap(player);
        this.treasureMap.getLayer("treasureIsland").tilemapLayer.setPosition(x, y);
        this.treasureMap.getLayer("treasureObjects").tilemapLayer.setPosition(x, y);
        this.hide();
    }

    public foundPiece(): void {
        console.log("foundPiece");
        for (let i = 0; i < this.visibility.length; i++) {
            for (let j = 0; j < this.visibility[i].length; j++) {
                if (!this.visibility[i][j] && Math.random() < 0.2) {
                    this.visibility[i][j] = true;
                }
            }
        }
        this.hide();
        this.show();
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
                    islandTile.setVisible(this.visibility[x][y]);
                }
                const objectTile = this.treasureMap.getLayer("treasureObjects").tilemapLayer.getTileAt(x, y);
                if (objectTile) {
                    objectTile.setVisible(this.visibility[x][y]);
                }
            }
        }
    }
}
