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

        // NOTE(Leon) : this is the map dims in world units
        GameSettings.MAP_WIDTH = mapWidth * tileSize;
        GameSettings.MAP_HEIGHT = mapHeight * tileSize;

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
        for (let x = 3; x < mapWidth - 4; x++) {
            for (let y = 3; y < mapHeight - 4; y++) {
                const dist = this.distanceSquared(x, y, mapWidth, mapHeight);
                const noise = (Perlin.perlin2((x / mapWidth) * 2 - 1, (y / mapHeight) * 2 - 1) + 1) / 2;
                if (noise * dist < 0.2) {
                    this.island.putTileAt(this.genSand(), x, y);
                }
            }
        }

        // Fix cases when we're unable to generate proper borders, e.g.
        // x x
        // xxx
        for (let x = 1; x < mapWidth - 1; x++) {
            for (let y = 1; y < mapHeight - 1; y++) {
                if (!this.island.hasTileAt(x, y) && this.adjacentIslandTiles(x, y) >= 3) {
                    this.island.putTileAt(this.genSand(), x, y);
                }
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
        const borders = map.createBlankLayer("borders", tileset);
        for (let x = 1; x < mapWidth - 1; x++) {
            for (let y = 1; y < mapHeight - 1; y++) {
                if (this.island.hasTileAt(x, y)) continue;

                if (
                    this.island.hasTileAt(x, y + 1) &&
                    !this.island.hasTileAt(x + 1, y) &&
                    !this.island.hasTileAt(x - 1, y)
                ) {
                    borders.putTileAt(PirateTile.TopMiddleEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x, y - 1) &&
                    !this.island.hasTileAt(x + 1, y) &&
                    !this.island.hasTileAt(x - 1, y)
                ) {
                    borders.putTileAt(PirateTile.BottomMiddleEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x - 1, y) &&
                    !this.island.hasTileAt(x, y - 1) &&
                    !this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.SideRightEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x + 1, y) &&
                    !this.island.hasTileAt(x, y - 1) &&
                    !this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.SideLeftEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x + 1, y + 1) &&
                    !this.island.hasTileAt(x + 1, y) &&
                    !this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.TopLeftSideSand, x, y);
                }

                if (
                    this.island.hasTileAt(x - 1, y + 1) &&
                    !this.island.hasTileAt(x - 1, y) &&
                    !this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.TopRightSideSand, x, y);
                }

                if (
                    this.island.hasTileAt(x - 1, y - 1) &&
                    !this.island.hasTileAt(x - 1, y) &&
                    !this.island.hasTileAt(x, y - 1)
                ) {
                    borders.putTileAt(PirateTile.BottomRightEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x + 1, y - 1) &&
                    !this.island.hasTileAt(x + 1, y) &&
                    !this.island.hasTileAt(x, y - 1)
                ) {
                    borders.putTileAt(PirateTile.BottomLeftEdgeSand, x, y);
                }

                if (
                    this.island.hasTileAt(x + 1, y + 1) &&
                    this.island.hasTileAt(x + 1, y) &&
                    this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.TopLeftCornerSand, x, y);
                }

                if (
                    this.island.hasTileAt(x - 1, y + 1) &&
                    this.island.hasTileAt(x - 1, y) &&
                    this.island.hasTileAt(x, y + 1)
                ) {
                    borders.putTileAt(PirateTile.TopRightCornerSand, x, y);
                }

                if (
                    this.island.hasTileAt(x - 1, y - 1) &&
                    this.island.hasTileAt(x - 1, y) &&
                    this.island.hasTileAt(x, y - 1)
                ) {
                    borders.putTileAt(PirateTile.BottomRightCornerSand, x, y);
                }

                if (
                    this.island.hasTileAt(x + 1, y - 1) &&
                    this.island.hasTileAt(x + 1, y) &&
                    this.island.hasTileAt(x, y - 1)
                ) {
                    borders.putTileAt(PirateTile.BottomLeftCornerSand, x, y);
                }
            }
        }

        for (let x = 1; x < mapWidth - 1; x++) {
            for (let y = 1; y < mapHeight - 1; y++) {
                if (borders.hasTileAt(x, y)) {
                    this.island.putTileAt(borders.getTileAt(x, y), x, y);
                }
            }
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

    private adjacentIslandTiles(x: number, y: number): number {
        let count = 0;
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];
        for (let i = 0; i < dx.length; i++) {
            if (this.island.hasTileAt(x + dx[i], y + dy[i])) count++;
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
