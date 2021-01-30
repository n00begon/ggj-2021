import { GameSettings } from "../utilities/GameSettings";
import { Perlin } from "../utilities/Perlin";

/**
 * Background manager controls the non interactive background objects
 */

export enum PirateTile {
    None = 0,

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
    private static gravelSandProb = 0.3;
    private static plainSandProb = 0.2;
    private static rockProb = 0.1;
    private static plantAProb = 0.05;
    private static plantBProb = 0.05;

    private water: Phaser.Tilemaps.TilemapLayer;
    private island: Phaser.Tilemaps.TilemapLayer;
    private objects: Phaser.Tilemaps.TilemapLayer;
    /**
     * Adds the parallax background to the scene
     */
    constructor(scene: Phaser.Scene) {
        const tileSize = 128;
        const mapWidth = Math.floor(scene.game.canvas.width / GameSettings.ZOOM_LEVEL / tileSize);
        const mapHeight = Math.floor(scene.game.canvas.height / GameSettings.ZOOM_LEVEL / tileSize);
        const map = scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: mapWidth,
            height: mapHeight,
        });
        const tileset = map.addTilesetImage("background", "background", tileSize, tileSize, 0, 4, 1);

        Perlin.Init();
        if (GameSettings.DEBUG) {
            Perlin.seed(GameSettings.DEBUG_SEED);
        } else {
            Perlin.seed(Math.random());
        }

        this.water = map.createBlankLayer("water", tileset);
        this.water.fill(PirateTile.Water, 0, 0, mapWidth, mapHeight);

        this.island = map.createBlankLayer("island", tileset);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            let count = 0;
            for (let x = 3; x < mapWidth - 4; x++) {
                for (let y = 3; y < mapHeight - 4; y++) {
                    const dist = this.distanceSquared(x, y, mapWidth, mapHeight);
                    const noise = (Perlin.perlin2(x / mapWidth, y / mapHeight) + 1) / 2;
                    if (noise > 0.3 + 0.4 * dist) {
                        this.island.putTileAt(this.genSand(), x, y);
                        count++;
                    }
                }
            }
            if (count / (mapWidth * mapHeight) < 0.2) {
                map.removeLayer(this.island);
                this.island = map.createBlankLayer("island", tileset);
                if (!GameSettings.DEBUG) Perlin.seed(Math.random());
            } else {
                break;
            }
        }

        this.objects = map.createBlankLayer("objects", tileset);
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                if (this.island.hasTileAt(x, y)) {
                    const object = this.genObject();
                    if (object != PirateTile.None) {
                        this.objects.putTileAt(object, x, y);
                    }
                }
            }
        }

        // Add borders
        // const borders = map.createBlankLayer("borders", tileset);
        // for (let x = 1; x < mapWidth - 1; x++) {
        //     for (let y = 1; y < mapHeight - 1; y++) {
        //         if (this.island.hasTileAt(x, y)) continue;

        //         if (
        //             this.island.hasTileAt(x, y + 1) &&
        //             !this.island.hasTileAt(x + 1, y) &&
        //             !this.island.hasTileAt(x - 1, y)
        //         ) {
        //             borders.putTileAt(PirateTile.TopMiddleEdgeSand, x, y);
        //         }
        //     }
        // }

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

    private nearbyIslandTiles(x: number, y: number): number {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (this.island.hasTileAt(x + dx, y + dy)) count++;
            }
        }
        return count;
    }

    private distanceSquared(x: number, y: number, width: number, height: number): number {
        const dx = (2 * x) / width - 1;
        const dy = (2 * y) / height - 1;
        return dx * dx + dy * dy;
    }

    private genSand(): PirateTile {
        let rnd = Math.random();

        if (rnd < BackgroundManager.gravelSandProb) {
            return PirateTile.CenterCenterGravelSand;
        } else {
            rnd -= BackgroundManager.gravelSandProb;
        }

        if (rnd < BackgroundManager.plainSandProb) {
            return PirateTile.CenterCenterPlainSand;
        }

        return PirateTile.CenterCenterDotsSand;
    }

    private genObject(): PirateTile {
        let rnd = Math.random();

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.Rock;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.plantAProb) {
            return PirateTile.PlantA;
        } else {
            rnd -= BackgroundManager.plantAProb;
        }

        if (rnd < BackgroundManager.plantBProb) {
            return PirateTile.PlantB;
        }

        return PirateTile.None;
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
