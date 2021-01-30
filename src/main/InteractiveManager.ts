import { Pirate, KeyControls } from "./objects/Pirate";
import { MainEventsManager } from "./MainEventsManager";
import { ControlManager } from "./ControlManager";
import { AnimationManager } from "./AnimationManager";
import { GameSettings } from "../utilities/GameSettings";

/**
 * InteractiveManager controls the interactive game objects and player interaction.
 * The core game logic is controlled from here
 */
export class InteractiveManager {
    private static readonly NEXT_SCENE = "End";

    private scene: Phaser.Scene;
    private controlManager: ControlManager;
    private maxScore: number;
    private currentScore: number;
    private pirateA: Pirate;
    private pirateB: Pirate;
    private screenWidth: number;
    private screenHeight: number;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.screenWidth = scene.game.canvas.width / GameSettings.ZOOM_LEVEL;
        this.screenHeight = scene.game.canvas.height / GameSettings.ZOOM_LEVEL;
        new AnimationManager(scene);
        this.controlManager = new ControlManager(scene);
        this.setupCamera(scene);
        this.maxScore = 0;
        this.currentScore = 0;
        MainEventsManager.on("maxscore", this.handleMaxScore, this);
        MainEventsManager.on("collection", this.handleCollection, this);
        this.pirateA = new Pirate(scene, KeyControls.WASD, this.screenWidth / 2 - 200, this.screenHeight / 2);
        this.pirateB = new Pirate(scene, KeyControls.Arrows, this.screenWidth / 2 - 200, this.screenHeight / 2 + 200);
    }
    /**
     * The main update loop for the scene.
     */
    public update(): void {
        this.pirateA.update();
        this.pirateB.update();
        this.controlManager.update();
    }
    /**
     * Keeps track of the maximum score
     *
     * @param amount - the change in maximum score
     */
    private handleMaxScore(amount: number): void {
        this.maxScore += amount;
    }
    /**
     * Keeps track of score changes. Ends the game when the current score
     * reaches the maximum score.
     *
     * @param amount - the amount of score collected
     */
    private handleCollection(amount: number): void {
        this.currentScore += amount;
        if (this.currentScore >= this.maxScore) {
            MainEventsManager.removeAllListeners();
            this.scene.scene.start(InteractiveManager.NEXT_SCENE);
        }
        MainEventsManager.emit("scoreChange", this.currentScore);
    }
    /**
     * Setups the camera
     */
    private setupCamera(scene: Phaser.Scene): void {
        scene.cameras.main.setBackgroundColor(new Phaser.Display.Color(207, 239, 252).color);
        scene.cameras.main.setZoom(GameSettings.ZOOM_LEVEL);
    }
}
