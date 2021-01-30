import { Pirate, KeyControls } from "./objects/Pirate";
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

    private static readonly LEFTBOUNDS = 0;
    private static readonly RIGHTBOUNDS = 2010;
    private static readonly TOPBOUNDS = -500;
    private static readonly BOTTOMBOUNDS = 800;
    private static readonly WORLDWIDTH = InteractiveManager.RIGHTBOUNDS - InteractiveManager.LEFTBOUNDS;
    private static readonly WORLDHEIGHT = InteractiveManager.BOTTOMBOUNDS - InteractiveManager.TOPBOUNDS;

    private scene: Phaser.Scene;
    private controlManager: ControlManager;

    private pirateA: Pirate;
    private pirateB: Pirate;
    private pirateC: Pirate;
    private screenWidth: number;
    private screenHeight: number;

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
            InteractiveManager.WORLDWIDTH / 2,
            InteractiveManager.BOTTOMBOUNDS - 500,
            backgroundManager.getIslandTilemap(),
        );
        this.pirateB = new Pirate(
            scene,
            KeyControls.Arrows,
            InteractiveManager.WORLDWIDTH / 2,
            InteractiveManager.BOTTOMBOUNDS - 300,
            backgroundManager.getIslandTilemap(),
        );

        this.pirateC = new Pirate(
            scene,
            KeyControls.Mouse,
            InteractiveManager.WORLDWIDTH / 2 - 500,
            InteractiveManager.BOTTOMBOUNDS - 300,
            backgroundManager.getIslandTilemap(),
        );
    }
    /**
     * The main update loop for the scene.
     */
    public update(): void {
        this.pirateA.update();
        this.pirateB.update();
        this.pirateC.update();
        this.controlManager.update();
    }

    /**
     * Setups the camera
     */
    private setupCamera(scene: Phaser.Scene): void {
        scene.cameras.main.setBackgroundColor(new Phaser.Display.Color(207, 239, 252).color);
        scene.cameras.main.setZoom(GameSettings.ZOOM_LEVEL);
        scene.cameras.main.setBounds(
            InteractiveManager.LEFTBOUNDS,
            InteractiveManager.TOPBOUNDS,
            InteractiveManager.WORLDWIDTH,
            InteractiveManager.WORLDHEIGHT,
        ); // Stops the camera moving off the edge of the screen
    }
}
