/**
 * Background manager controls the non interactive background objects
 */
export class BackgroundManager {
    /**
     * Adds the parallax background to the scene
     */
    constructor(scene: Phaser.Scene) {
        const map = scene.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("background", "background");
        const water = map.createLayer(0, tileset, 0, 0);
        const island = map.createLayer(1, tileset, 0, 0);
        const objects = map.createLayer(2, tileset, 0, 0);

        // temp
        scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
}
