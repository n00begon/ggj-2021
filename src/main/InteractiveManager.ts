import { Pirate } from "./objects/Pirate";
import { Barrel } from "./objects/Barrel";
import { KeyControls } from "./KeyControls";
import { MainEventsManager } from "./MainEventsManager";
import { ControlManager } from "./ControlManager";
import { AnimationManager } from "./AnimationManager";
import { BackgroundManager } from "./BackgroundManager";
import { GameSettings } from "../utilities/GameSettings";

/**
 * InteractiveManager controls the interactive game objects and player interaction.
 * The core game logic is controlled from here
 */
export class InteractiveManager {
    private static readonly NEXT_SCENE = "End";

    private scene: Phaser.Scene;
    private controlManager: ControlManager;

    private pirateA: Pirate;
    private pirateB: Pirate;
    private screenWidth: number;
    private screenHeight: number;
    private barrels: Array<Barrel>;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene, backgroundManager: BackgroundManager) {
        this.scene = scene;
        this.screenWidth = scene.game.canvas.width / GameSettings.ZOOM_LEVEL;
        this.screenHeight = scene.game.canvas.height / GameSettings.ZOOM_LEVEL;
        new AnimationManager(scene);
        this.controlManager = new ControlManager(scene);
        this.setupCamera(scene);

        this.pirateA = new Pirate(
            scene,
            KeyControls.WASD,
            this.screenWidth / 2,
            this.screenHeight / 2,
            backgroundManager.getIslandTilemap(),
            backgroundManager.getCollisionTilemap(),
        );
        this.pirateB = new Pirate(
            scene,
            KeyControls.Arrows,
            this.screenWidth / 2,
            this.screenHeight / 2 - 300,
            backgroundManager.getIslandTilemap(),
            backgroundManager.getCollisionTilemap(),
        );

        this.barrels = new Array<Barrel>();
        const barrelsCoords = backgroundManager.getBarrels();
        for (let i = 0; i < barrelsCoords.length; i++) {
            this.barrels.push(new Barrel(scene, barrelsCoords[i].getCenterX(), barrelsCoords[i].getCenterY()));
        }
    }
    /**
     * The main update loop for the scene.
     */
    public update(): void {
        this.pirateA.update();
        this.pirateB.update();

        // NOTE(Leon) I dunno how else to pass coordinates to the HUD system?
        const xyWASD = this.pirateA.pirate.getCenter();
        MainEventsManager.emit("playerXY", KeyControls.WASD, xyWASD.x, xyWASD.y);

        const xyArrows = this.pirateB.pirate.getCenter();
        MainEventsManager.emit("playerXY", KeyControls.Arrows, xyArrows.x, xyArrows.y);

        this.controlManager.update();
    }

    /**
     * Setups the camera
     */
    private setupCamera(scene: Phaser.Scene): void {
        scene.cameras.main.setBackgroundColor(new Phaser.Display.Color(207, 239, 252).color);
        scene.cameras.main.setZoom(GameSettings.ZOOM_LEVEL);
    }
}
