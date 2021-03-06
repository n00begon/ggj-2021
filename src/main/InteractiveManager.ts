import { Pirate } from "./objects/Pirate";
import { Barrel } from "./objects/Barrel";
import { ControlManager } from "./ControlManager";
import { AnimationManager } from "./AnimationManager";
import { BackgroundManager } from "./BackgroundManager";
import { GameSettings } from "../utilities/GameSettings";
import { MainEventsManager } from "./MainEventsManager";
import { Boat } from "./objects/Boat";

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
    private pirateC: Pirate;
    private pirateD: Pirate;
    private screenWidth: number;
    private screenHeight: number;
    private barrels: Array<Barrel>;
    private boats: Array<Boat>;

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

        // scene.matter.world.setBounds(0, 0, this.screenWidth, this.screenHeight);
        MainEventsManager.on("GameWon", this.handleGameWon, this);
        this.pirateA = new Pirate(
            scene,
            1,
            this.screenWidth / 2,
            this.screenHeight / 2,
            backgroundManager.getCollisionTilemap(),
            backgroundManager.getHoleTilemap(),
            GameSettings.XmarksTheSpot,
        );

        this.pirateB = new Pirate(
            scene,
            2,
            this.screenWidth / 2,
            this.screenHeight / 2 - 300,
            backgroundManager.getCollisionTilemap(),
            backgroundManager.getHoleTilemap(),
            GameSettings.XmarksTheSpot,
        );

        this.pirateC = new Pirate(
            scene,
            3,
            this.screenWidth / 2 + 300,
            this.screenHeight / 2,
            backgroundManager.getCollisionTilemap(),
            backgroundManager.getHoleTilemap(),
            GameSettings.XmarksTheSpot,
        );

        this.pirateD = new Pirate(
            scene,
            4,
            this.screenWidth / 2 + 300,
            this.screenHeight / 2 - 300,
            backgroundManager.getCollisionTilemap(),
            backgroundManager.getHoleTilemap(),
            GameSettings.XmarksTheSpot,
        );

        this.pirateA.addCollider(scene, this.pirateB);
        this.pirateA.addCollider(scene, this.pirateC);
        this.pirateA.addCollider(scene, this.pirateD);
        this.pirateB.addCollider(scene, this.pirateC);
        this.pirateB.addCollider(scene, this.pirateD);
        this.pirateC.addCollider(scene, this.pirateD);

        // NOTE(Leon) : sprinkle our barrels with puzzle pieces!
        const validPuzzleCoords = [
            new Phaser.Math.Vector2(0, 0),
            new Phaser.Math.Vector2(1, 0),
            new Phaser.Math.Vector2(2, 0),
            new Phaser.Math.Vector2(0, 1),
            new Phaser.Math.Vector2(1, 1),
            new Phaser.Math.Vector2(2, 1),
            new Phaser.Math.Vector2(0, 2),
            new Phaser.Math.Vector2(1, 2),
            new Phaser.Math.Vector2(2, 2),
        ];

        this.barrels = new Array<Barrel>();
        const barrelsCoords = backgroundManager.getBarrels();
        for (let i = 0; i < barrelsCoords.length; i++) {
            const barrel = new Barrel(
                scene,
                barrelsCoords[i].getCenterX(),
                barrelsCoords[i].getCenterY(),
                this.pirateA,
                this.pirateB,
                this.pirateC,
                this.pirateD,
            );
            if (validPuzzleCoords.length > 0) {
                const puzzle_index = Phaser.Math.RND.integerInRange(0, validPuzzleCoords.length - 1);
                const puzzleCoord = validPuzzleCoords[puzzle_index];
                validPuzzleCoords.splice(puzzle_index, 1);
                if (puzzleCoord !== undefined) {
                    barrel.isPuzzlePiece = true;
                    barrel.puzzleX = puzzleCoord.x;
                    barrel.puzzleY = puzzleCoord.y;
                }
            }

            this.barrels.push(barrel);
        }

        this.boats = new Array<Boat>();
        const boatsCoords = backgroundManager.getBoats();
        for (let i = 0; i < boatsCoords.length; i++) {
            const boat = new Boat(
                scene,
                boatsCoords[i].getCenterX(),
                boatsCoords[i].getCenterY(),
                this.pirateA,
                this.pirateB,
                this.pirateC,
                this.pirateD,
            );

            this.boats.push(boat);
        }

        if (GameSettings.DEBUG) {
            this.scene.add.rectangle(GameSettings.XmarksTheSpot.x, GameSettings.XmarksTheSpot.y, 8, 8, 0xff0000);
        }
    }
    /**
     * The main update loop for the scene.
     */
    public update(): void {
        this.pirateA.update();
        this.pirateB.update();
        this.pirateC.update();
        this.pirateD.update();

        this.controlManager.update();
    }

    /**
     * Setups the camera
     */
    private setupCamera(scene: Phaser.Scene): void {
        scene.cameras.main.setBackgroundColor(new Phaser.Display.Color(207, 239, 252).color);
        scene.cameras.main.setZoom(GameSettings.ZOOM_LEVEL);
    }

    private handleGameWon(): void {
        MainEventsManager.removeAllListeners();
        this.scene.scene.start(InteractiveManager.NEXT_SCENE);
    }
}
