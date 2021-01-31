import { GameSettings } from "../../utilities/GameSettings";
import { BackgroundManager } from "../BackgroundManager";
import { PuzzleMap } from "./PuzzleMap";

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private maps: Array<PuzzleMap> = new Array<PuzzleMap>(2);
    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene, background: BackgroundManager) {
        this.maps.push(new PuzzleMap(scene, 0, 0, 1, background));
        this.maps.push(
            new PuzzleMap(
                scene,
                Math.floor((scene.game.canvas.width - 300) / GameSettings.ZOOM_LEVEL),
                0,
                2,
                background,
            ),
        );
        this.maps.push(
            new PuzzleMap(
                scene,
                0,
                Math.floor((scene.game.canvas.height - 300) / GameSettings.ZOOM_LEVEL),
                3,
                background,
            ),
        );
        this.maps.push(
            new PuzzleMap(
                scene,
                Math.floor((scene.game.canvas.width - 300) / GameSettings.ZOOM_LEVEL),
                Math.floor((scene.game.canvas.height - 300) / GameSettings.ZOOM_LEVEL),
                4,
                background,
            ),
        );
    }
}
