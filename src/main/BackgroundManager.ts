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

    RockA = 9,
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
    Hole1 = 20,
    Hole2 = 21,
    Hole3 = 22,
    Hole4 = 23,

    PlantC = 24,
    PlantD = 25,

    RockB = 26,
    RockC = 27,
    RockD = 28,
    RockE = 29,
    RockF = 30,

    PlantE = 31,
}

export class BackgroundManager {
    private static gravelSandProb = 0.3;
    private static plainSandProb = 0.2;
    private static rockProb = 0.02;
    private static plantProb = 0.01;
    private static holeProb = 1 / 4;

    private water: Phaser.Tilemaps.TilemapLayer;
    private island: Phaser.Tilemaps.TilemapLayer;
    private objects: Phaser.Tilemaps.TilemapLayer;
    private collision: Phaser.Tilemaps.TilemapLayer;
    private holes: Phaser.Tilemaps.TilemapLayer;
    private barrels: Array<Phaser.Tilemaps.Tile>;
    private treasureMap1: Phaser.Tilemaps.Tilemap;
    private treasureMap2: Phaser.Tilemaps.Tilemap;
    private treasureMap3: Phaser.Tilemaps.Tilemap;
    private treasureMap4: Phaser.Tilemaps.Tilemap;

    private boats: Array<Phaser.Tilemaps.Tile>;

    /**
     * Adds the parallax background to the scene
     */
    constructor(scene: Phaser.Scene) {
        const tileSize = 128;
        const mapWidth = Math.floor(scene.game.canvas.width / GameSettings.ZOOM_LEVEL / tileSize);
        const mapHeight = Math.floor(scene.game.canvas.height / GameSettings.ZOOM_LEVEL / tileSize);

        GameSettings.MAP_WIDTH = mapWidth * tileSize;
        GameSettings.MAP_HEIGHT = mapHeight * tileSize;

        const map = scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: mapWidth,
            height: mapHeight,
        });
        const tileset = map.addTilesetImage("newbackground", "newbackground", tileSize, tileSize, 0, 4, 1);

        Perlin.Init();
        if (GameSettings.DEBUG) {
            Perlin.seed(GameSettings.DEBUG_SEED);
        } else {
            Perlin.seed(Math.random());
        }

        this.water = map.createBlankLayer("water", tileset);

        this.water.fill(PirateTile.Water, 0, 0, mapWidth, mapHeight);

        this.island = map.createBlankLayer("island", tileset);
        this.holes = map.createBlankLayer("holes", tileset);

        for (let x = 3; x < mapWidth - 4; x++) {
            for (let y = 3; y < mapHeight - 4; y++) {
                const dist = this.distanceSquared(x, y, mapWidth, mapHeight);
                const noise = (Perlin.perlin2((x / mapWidth) * 2 - 1, (y / mapHeight) * 2 - 1) + 1) / 2;
                if (noise * dist < 0.2) {
                    this.island.putTileAt(this.genSand(), x, y);
                    this.holes.putTileAt(this.genHole(), x, y).setVisible(false);
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
                    this.holes.putTileAt(this.genHole(), x, y).setVisible(false);
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
                        this.holes.removeTileAt(x, y);
                    }
                }
            }
        }

        this.barrels = new Array<Phaser.Tilemaps.Tile>();
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                if (this.island.hasTileAt(x, y) && !this.objects.hasTileAt(x, y)) {
                    this.barrels.push(this.island.getTileAt(x, y));
                }
            }
        }
        for (let i = this.barrels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.barrels[i];
            this.barrels[i] = this.barrels[j];
            this.barrels[j] = temp;
        }

        // Not actually a barrel location but just an easy way to randomly choose a tile without other objects :)
        const treasureLocation = this.barrels[this.barrels.length - 1];
        GameSettings.XmarksTheSpot = new Phaser.Math.Vector2(
            treasureLocation.getCenterX(),
            treasureLocation.getCenterY(),
        );

        const barrelsCnt = 5 + 5 * Math.random();
        while (this.barrels.length > barrelsCnt) this.barrels.pop();

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

        this.boats = new Array<Phaser.Tilemaps.Tile>();
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                if (
                    borders.hasTileAt(x, y) &&
                    borders.getTileAt(x, y).index != PirateTile.BottomLeftCornerSand &&
                    borders.getTileAt(x, y).index != PirateTile.TopLeftCornerSand &&
                    borders.getTileAt(x, y).index != PirateTile.TopRightCornerSand &&
                    borders.getTileAt(x, y).index != PirateTile.BottomRightCornerSand &&
                    this.adjacentObjectTiles(x, y) == 0 &&
                    this.adjacentBarrels(x, y) == 0
                ) {
                    this.boats.push(borders.getTileAt(x, y));
                }
            }
        }
        for (let i = this.boats.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.boats[i];
            this.boats[i] = this.boats[j];
            this.boats[j] = temp;
        }

        const boatsCnt = 4 + 1 * Math.random();
        while (this.boats.length > boatsCnt) this.boats.pop();
        for (let i = 0; i < this.boats.length; i++) {
            for (let j = i + 1; j < this.boats.length; j++) {
                if (Math.abs(this.boats[i].x - this.boats[j].x) <= 2 && this.boats[i].y == this.boats[j].y) {
                    const temp = this.boats[this.boats.length - 1];
                    this.boats[this.boats.length - 1] = this.boats[j];
                    this.boats[j] = temp;
                    this.boats.pop();
                    j--;
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

        this.collision = map.createBlankLayer("collision", tileset);
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                if (!this.island.hasTileAt(x, y)) {
                    this.collision.putTileAt(PirateTile.Water, x, y);
                }

                if (this.objects.hasTileAt(x, y)) {
                    const tile = this.objects.getTileAt(x, y).index;
                    if (
                        tile == PirateTile.RockA ||
                        tile == PirateTile.RockB ||
                        tile == PirateTile.RockC ||
                        tile == PirateTile.RockD ||
                        tile == PirateTile.RockE ||
                        tile == PirateTile.RockF
                    ) {
                        this.collision.putTileAt(tile, x, y);
                    }
                }
            }
        }

        this.treasureMap1 = this.createTreasureMap(scene, tileSize, tileset, mapWidth, mapHeight, treasureLocation);
        this.treasureMap2 = this.createTreasureMap(scene, tileSize, tileset, mapWidth, mapHeight, treasureLocation);
        this.treasureMap3 = this.createTreasureMap(scene, tileSize, tileset, mapWidth, mapHeight, treasureLocation);
        this.treasureMap4 = this.createTreasureMap(scene, tileSize, tileset, mapWidth, mapHeight, treasureLocation);

        scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    private createTreasureMap(
        scene: Phaser.Scene,
        tileSize: number,
        tileset: Phaser.Tilemaps.Tileset,
        mapWidth: number,
        mapHeight: number,
        treasureLocation: Phaser.Tilemaps.Tile,
    ): Phaser.Tilemaps.Tilemap {
        const treasureMapSize = 5;

        const treasureMap = scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: treasureMapSize,
            height: treasureMapSize,
        });
        const treasureWater = treasureMap.createBlankLayer("treasureWater", tileset);
        treasureWater.fill(PirateTile.Water, 0, 0, mapWidth, mapHeight);

        for (let x = 0; x < treasureMapSize; x++) {
            for (let y = 0; y < treasureMapSize; y++) {
                treasureWater.getTileAt(x, y).setVisible(false);
            }
        }
        const treasureIsland = treasureMap.createBlankLayer("treasureIsland", tileset);
        for (let x = 0; x < treasureMapSize; x++) {
            for (let y = 0; y < treasureMapSize; y++) {
                const islandTile = this.island.getTileAtWorldXY(
                    treasureLocation.getCenterX() + tileSize * (x - Math.floor(treasureMapSize / 2)),
                    treasureLocation.getCenterY() + tileSize * (y - Math.floor(treasureMapSize / 2)),
                );
                if (islandTile) {
                    treasureIsland.putTileAt(islandTile.index, x, y).setVisible(true);
                }
            }
        }

        const treasureObjects = treasureMap.createBlankLayer("treasureObjects", tileset);
        for (let x = 0; x < treasureMapSize; x++) {
            for (let y = 0; y < treasureMapSize; y++) {
                const objectTile = this.objects.getTileAtWorldXY(
                    treasureLocation.getCenterX() + tileSize * (x - Math.floor(treasureMapSize / 2)),
                    treasureLocation.getCenterY() + tileSize * (y - Math.floor(treasureMapSize / 2)),
                );
                if (objectTile) {
                    treasureObjects.putTileAt(objectTile.index, x, y).setVisible(true);
                }
            }
        }
        return treasureMap;
    }

    public getTreasureMap(player: number): Phaser.Tilemaps.Tilemap {
        if (player === 1) {
            return this.treasureMap1;
        }

        if (player === 2) {
            return this.treasureMap2;
        }
        if (player === 3) {
            return this.treasureMap3;
        }
        return this.treasureMap4;
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

    private adjacentObjectTiles(x: number, y: number): number {
        let count = 0;
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];
        for (let i = 0; i < dx.length; i++) {
            if (this.objects.hasTileAt(x + dx[i], y + dy[i])) count++;
        }
        return count;
    }

    private adjacentBarrels(x: number, y: number): number {
        let count = 0;
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];
        for (let i = 0; i < dx.length; i++) {
            if (this.isBarrel(x + dx[i], y + dy[i])) count++;
        }
        return count;
    }

    private distanceSquared(x: number, y: number, width: number, height: number): number {
        const dx = (2 * x) / width - 1;
        const dy = (2 * y) / height - 1;
        return dx * dx + dy * dy;
    }

    private isBarrel(x: number, y: number): boolean {
        for (let i = 0; i < this.barrels.length; i++) {
            if (this.barrels[i].x == x && this.barrels[i].y == y) return true;
        }
        return false;
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

    private genHole(): PirateTile {
        let rnd = Math.random();

        if (rnd < BackgroundManager.holeProb) {
            return PirateTile.Hole1;
        } else {
            rnd -= BackgroundManager.holeProb;
        }

        if (rnd < BackgroundManager.holeProb) {
            return PirateTile.Hole2;
        } else {
            rnd -= BackgroundManager.holeProb;
        }

        if (rnd < BackgroundManager.holeProb) {
            return PirateTile.Hole3;
        } else {
            rnd -= BackgroundManager.holeProb;
        }

        if (rnd < BackgroundManager.holeProb) {
            return PirateTile.Hole4;
        } else {
            rnd -= BackgroundManager.holeProb;
        }

        return PirateTile.Hole1;
    }

    private genObject(): PirateTile {
        let rnd = Math.random();

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockA;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockB;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockC;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockD;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockE;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.rockProb) {
            return PirateTile.RockF;
        } else {
            rnd -= BackgroundManager.rockProb;
        }

        if (rnd < BackgroundManager.plantProb) {
            return PirateTile.PlantA;
        } else {
            rnd -= BackgroundManager.plantProb;
        }

        if (rnd < BackgroundManager.plantProb) {
            return PirateTile.PlantB;
        } else {
            rnd -= BackgroundManager.plantProb;
        }

        if (rnd < BackgroundManager.plantProb) {
            return PirateTile.PlantC;
        } else {
            rnd -= BackgroundManager.plantProb;
        }

        if (rnd < BackgroundManager.plantProb) {
            return PirateTile.PlantD;
        } else {
            rnd -= BackgroundManager.plantProb;
        }

        if (rnd < BackgroundManager.plantProb) {
            return PirateTile.PlantE;
        } else {
            rnd -= BackgroundManager.plantProb;
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

    public getHoleTilemap(): Phaser.Tilemaps.TilemapLayer {
        return this.holes;
    }

    public getCollisionTilemap(): Phaser.Tilemaps.TilemapLayer {
        return this.collision;
    }

    public getBarrels(): Array<Phaser.Tilemaps.Tile> {
        return this.barrels;
    }

    public getBoats(): Array<Phaser.Tilemaps.Tile> {
        return this.boats;
    }

    private randInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
