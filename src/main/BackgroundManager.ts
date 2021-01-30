import { GameSettings } from "../utilities/GameSettings";

/**
 * Background manager controls the non interactive background objects
 */

export enum PirateTile {
    BottomLeftCornerSand = 1,
    BottomLeftEdgeSand = 2,
    BottomMiddleEdgeSand = 3,
    BottomRightCornerSand = 4,
    BottomRightEdgeSand = 5,

    CenterCenterGravelSand = 6,
    CenterCenterPlainSand = 7,
    CenterCenterDotsSand = 8,

    Rock = 9,
    PlantA = 10,
    PlantB = 11,

    SideLeftEdgeSand = 12,
    SideRightEdgeSand = 13,
    TopLeftCornerSand = 14,
    TopLeftSideSand = 15,
    TopMiddleEdgeSand = 16,
    TopRightCornerSand = 17,
    TopRightSideSand = 18,

    Water = 19,
}

export class BackgroundManager {
    private water: Phaser.Tilemaps.TilemapLayer;
    private island: Phaser.Tilemaps.TilemapLayer;
    private objects: Phaser.Tilemaps.TilemapLayer;
    /**
     * Adds the parallax background to the scene
     */
    constructor(scene: Phaser.Scene) {
        const tileSize = 128;
        const mapWidth = Math.floor(scene.game.canvas.width /* / GameSettings.ZOOM_LEVEL*/ / tileSize);
        const mapHeight = Math.floor(scene.game.canvas.height /* / GameSettings.ZOOM_LEVEL*/ / tileSize);
        const map = scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: mapWidth,
            height: mapHeight,
        });
        const tileset = map.addTilesetImage("background", "background", tileSize, tileSize, 0, 4, 1);
        this.water = map.createBlankLayer("water", tileset);
        this.island = map.createBlankLayer("island", tileset);
        this.objects = map.createBlankLayer("objects", tileset);

        const islandData = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterPlainSand,
            PirateTile.CenterCenterGravelSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterGravelSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterPlainSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterGravelSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterPlainSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterGravelSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterGravelSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            0,
            0,
            0,
            0,
            0,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterDotsSand,
            PirateTile.CenterCenterGravelSand,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
        ];

        const objectData = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.PlantB,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.Rock,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.PlantA,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.Rock,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.PlantA,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
        ];

        this.water.fill(PirateTile.Water, 0, 0, mapWidth, mapHeight);
        for (let i = 0; i < islandData.length; i++) {
            this.island.putTileAt(islandData[i], Math.floor(i / mapHeight), i % mapHeight);
        }
        for (let i = 0; i < objectData.length; i++) {
            this.objects.putTileAt(objectData[i], Math.floor(i / mapHeight), i % mapHeight);
        }
        const debugGraphics = scene.add.graphics();

        this.objects.setCollisionByProperty({ collides: true });
        this.objects.renderDebug(debugGraphics, {
            tileColor: new Phaser.Display.Color(5, 5, 5, 100), // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(211, 36, 255, 100), // Colliding tiles
            faceColor: new Phaser.Display.Color(211, 36, 255, 255), // Colliding face edges
        });

        // temp
        scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    public getWaterTilemap(): Phaser.Tilemaps.TilemapLayer {
        return this.water;
    }

    public getIslandTilemap(): Phaser.Tilemaps.TilemapLayer {
        return this.island;
    }

    public getObjectsTilemap(): Phaser.Tilemaps.TilemapLayer {
        return this.objects;
    }
}
