import { MainEventsManager } from "../MainEventsManager";

/**
 * Pirate is the character that the player controls.
 */
export class Pirate {
    private static readonly MOVE_SPEED = 100;
    private pirate: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private currentSpeed = 0;
    private leftMove = false;
    private rightMove = false;

    /**
     * Creates the pirate object
     *
     * @param scene - the phaser scene to add the object to
     * @param x - the x position where pirate will start
     * @param y - the y position where pirate will start
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.pirate = scene.physics.add.sprite(x, y, "sprites", "pirate");

        this.pirate.setFriction(0);
        this.scene.cameras.main.startFollow(this.pirate);
        this.pirate.play("pirateWalk");
        MainEventsManager.on("leftMove", this.handleLeftMove, this);
        MainEventsManager.on("rightMove", this.handleRightMove, this);
    }

    /**
     * The update cycle.This is controlling the movement
     */
    public update(): void {
        this.pirate.setVelocityX(0);

        let direction = 0;
        if (this.leftMove) {
            direction = -1;
        }

        if (this.rightMove) {
            direction = 1;
        }
        if (direction !== 0) {
            this.currentSpeed = direction * Pirate.MOVE_SPEED;
            this.pirate.setVelocityX(this.currentSpeed);
        }

        this.leftMove = false;
        this.rightMove = false;
        this.leftMove = false;
        this.rightMove = false;
    }

    /**
     * handles when it receives a left move event.
     */
    private handleLeftMove(): void {
        this.leftMove = true;
    }

    /**
     * handles when it receives a right move event.
     */
    private handleRightMove(): void {
        this.rightMove = true;
    }
}
