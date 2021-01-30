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

        const water = map.createBlankLayer("water", tileset);
        water.fill(PirateTile.Water, 0, 0, mapWidth, mapHeight);

        let island = map.createBlankLayer("island", tileset);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            let count = 0;
            for (let x = 3; x < mapWidth - 4; x++) {
                for (let y = 3; y < mapHeight - 4; y++) {
                    const dist = this.distanceSquared(x, y, mapWidth, mapHeight);
                    const noise = (Perlin.perlin2(x / mapWidth, y / mapHeight) + 1) / 2;
                    if (noise > 0.3 + 0.4 * dist) {
                        island.putTileAt(this.genSand(), x, y);
                        count++;
                    }
                }
            }
            if (count / (mapWidth * mapHeight) < 0.5) {
                map.removeLayer("island");
                island = map.createBlankLayer("island", tileset);
                if (!GameSettings.DEBUG) Perlin.seed(Math.random());
            } else {
                break;
            }
        }

        const objects = map.createBlankLayer("objects", tileset);
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                if (island.hasTileAt(x, y)) {
                    const object = this.genObject();
                    if (object != PirateTile.None) {
                        objects.putTileAt(object, x, y);
                    }
                }
            }
        }

        // temp
        scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
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
}
