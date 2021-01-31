import { PuzzleMap } from "./PuzzleMap";

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private maps: Array<PuzzleMap> = new Array<PuzzleMap>(2);
    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        this.maps.push(new PuzzleMap(scene, 64, 64, 1));
        this.maps.push(new PuzzleMap(scene, 800, 64, 2));
    }
}
