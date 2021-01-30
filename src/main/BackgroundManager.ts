/**
 * Background manager controls the non interactive background objects
 */

export enum PirateTile {
    IslandA = 6,
    DarkIsland = 7,
    LightIsland = 8,

    Rock = 9,
    PlantA = 10,
    PlantB = 11,
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
        const mapSize = 10;
        const map = scene.make.tilemap({ tileWidth: tileSize, tileHeight: tileSize, width: mapSize, height: mapSize });
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
            PirateTile.LightIsland,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            0,
            0,
            0,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.DarkIsland,
            PirateTile.IslandA,
            PirateTile.LightIsland,
            PirateTile.IslandA,
            PirateTile.LightIsland,
            0,
            0,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.DarkIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            0,
            0,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.IslandA,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.DarkIsland,
            PirateTile.LightIsland,
            PirateTile.IslandA,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.IslandA,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            0,
            0,
            0,
            0,
            0,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.LightIsland,
            PirateTile.IslandA,
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

        this.water.fill(19, 0, 0, mapSize, mapSize);
        for (let i = 0; i < islandData.length; i++) {
            this.island.putTileAt(islandData[i], Math.floor(i / mapSize), i % mapSize);
        }
        for (let i = 0; i < objectData.length; i++) {
            this.objects.putTileAt(objectData[i], Math.floor(i / mapSize), i % mapSize);
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
