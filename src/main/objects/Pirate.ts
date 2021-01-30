import { GameSettings } from "../../utilities/GameSettings";
import { PlainText } from "../../utilities/text/PlainText";
import { PirateTile } from "../BackgroundManager";
import { KeyControls } from "../KeyControls";
import { MainEventsManager } from "../MainEventsManager";

/**
 * Pirate is the character that the player controls.
 */
export class Pirate {
    private static readonly MOVE_SPEED = 300;
    public pirate: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private currentSpeedX = 0;
    private leftMove = false;
    private rightMove = false;
    private debugText: Phaser.GameObjects.Text;
    private upMove = false;
    private downMove = false;
    private currentSpeedY = 0;
    private island: Phaser.Tilemaps.TilemapLayer;
    /**
     * Creates the pirate object
     *
     * @param scene - the phaser scene to add the object to
     * @param x - the x position where pirate will start
     * @param y - the y position where pirate will start
     */
    constructor(
        scene: Phaser.Scene,
        controls: KeyControls,
        x: number,
        y: number,
        layer: Phaser.Tilemaps.TilemapLayer,
        collisionLayer: Phaser.Tilemaps.TilemapLayer,
    ) {
        this.scene = scene;
        this.pirate = scene.physics.add.sprite(x, y, "sprites", "pirate");
        this.island = layer;
        this.pirate.setFriction(0);
        this.scene.cameras.main.startFollow(this.pirate);
        this.pirate.play("pirateWalk");
        this.pirate.setBounce(0.1);
        scene.physics.add.collider(this.pirate, collisionLayer);
        collisionLayer.setCollision(PirateTile.Water);
        if (controls === KeyControls.WASD) {
            MainEventsManager.on("leftMove2", this.handleLeftMove, this);
            MainEventsManager.on("rightMove2", this.handleRightMove, this);
            MainEventsManager.on("upMove2", this.handleUpMove, this);
            MainEventsManager.on("downMove2", this.handleDownMove, this);
        } else if (controls == KeyControls.Arrows) {
            MainEventsManager.on("leftMove", this.handleLeftMove, this);
            MainEventsManager.on("rightMove", this.handleRightMove, this);
            MainEventsManager.on("upMove", this.handleUpMove, this);
            MainEventsManager.on("downMove", this.handleDownMove, this);
        } else if (controls == KeyControls.Mouse) {
            MainEventsManager.on("leftMove3", this.handleLeftMove, this);
            MainEventsManager.on("rightMove3", this.handleRightMove, this);
            MainEventsManager.on("upMove3", this.handleUpMove, this);
            MainEventsManager.on("downMove3", this.handleDownMove, this);
        }

        this.debugText = scene.add.text(x, y, "Yo Ho", {
            fontFamily: GameSettings.DISPLAY_FONT,
            color: GameSettings.FONT_COLOUR,
        });

        this.debugText.setFontSize(50);
    }
    /**
     * The update cycle.This is controlling the movement
     */
    public update(): void {
        const currentTile = this.island.getTileAtWorldXY(this.pirate.x, this.pirate.y);

        this.pirate.setVelocityX(0);

        if (this.leftMove || this.rightMove || this.upMove || this.downMove) {
            this.pirate.play("pirateWalk", true);
        } else {
            this.pirate.anims.stop();
        }

        let x_dir = 0;
        if (this.leftMove) {
            x_dir = -1;
        }

        if (this.rightMove) {
            x_dir = 1;
        }
        if (x_dir !== 0) {
            this.currentSpeedX = x_dir * Pirate.MOVE_SPEED;
            this.pirate.setVelocityX(this.currentSpeedX);
        }

        this.leftMove = false;
        this.rightMove = false;

        this.pirate.setVelocityY(0);

        let y_dir = 0;
        if (this.upMove) {
            y_dir = -1;
        }

        if (this.downMove) {
            y_dir = 1;
        }
        if (y_dir !== 0) {
            this.currentSpeedY = y_dir * Pirate.MOVE_SPEED;
            this.pirate.setVelocityY(this.currentSpeedY);
        }

        this.upMove = false;
        this.downMove = false;
        this.debugText.setPosition(this.pirate.x, this.pirate.y);
        if (currentTile) {
            this.debugText.setText("" + currentTile.canCollide + " " + PirateTile[currentTile.index]);
        } else {
            this.debugText.setText("null");
        }
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

    /**
     * handles when it receives a up move event.
     */
    private handleUpMove(): void {
        this.upMove = true;
    }

    /**
     * handles when it receives a down move event.
     */
    private handleDownMove(): void {
        this.downMove = true;
    }
}
