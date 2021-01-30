import { PirateTile } from "../BackgroundManager";
import { KeyControls } from "../KeyControls";
import { MainEventsManager } from "../MainEventsManager";
import { Barrel } from "./Barrel";

/**
 * Pirate is the character that the player controls.
 */
export class Pirate {
    private static readonly MOVE_SPEED = 300;
    private static readonly DIGWAIT = 50;
    private static readonly DIGTIME = 100;

    private pirate: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private currentSpeedX = 0;
    private leftMove = false;
    private rightMove = false;
    //private debugText: Phaser.GameObjects.Text;
    private upMove = false;
    private downMove = false;
    private currentSpeedY = 0;
    private holes: Phaser.Tilemaps.TilemapLayer;
    private walkSound: Phaser.Sound.BaseSound;
    private digSound: Phaser.Sound.BaseSound;
    private controls: KeyControls;
    private digwait = 0;
    private digtime = 0;
    private digging = false;
    private frontDust: Phaser.GameObjects.Sprite;
    private rearDust: Phaser.GameObjects.Sprite;
    private XmarksTheSpot: Phaser.Math.Vector2;

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
        collisionLayer: Phaser.Tilemaps.TilemapLayer,
        holeLayer: Phaser.Tilemaps.TilemapLayer,
        XmarksTheSpot: Phaser.Math.Vector2,
    ) {
        this.scene = scene;
        this.controls = controls;
        this.pirate = scene.physics.add.sprite(x, y, "sprites", "pirate");
        this.frontDust = scene.add.sprite(x, y, "sprites", "Dust1");
        this.frontDust.setVisible(false);
        this.rearDust = scene.add.sprite(x, y, "sprites", "DustBack1");
        this.rearDust.setVisible(false);

        this.XmarksTheSpot = XmarksTheSpot;

        this.pirate.setFriction(0);
        this.scene.cameras.main.startFollow(this.pirate);
        this.pirate.play("pirateWalk");
        this.walkSound = scene.sound.get("walking1");
        this.digSound = scene.sound.get("dig");
        this.pirate.setBodySize(this.pirate.width, this.pirate.height - 50);
        this.holes = holeLayer;
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

        // this.debugText = scene.add.text(x, y, "Yo Ho", {
        //     fontFamily: GameSettings.DISPLAY_FONT,
        //     color: GameSettings.FONT_COLOUR,
        // // });

        // this.debugText.setFontSize(50);
    }

    public getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.pirate;
    }

    public receivedBarrel(barrel: Barrel): void {
        if (barrel.isPuzzlePiece) {
            MainEventsManager.emit("foundPuzzle", KeyControls.WASD, barrel.puzzleX, barrel.puzzleY);
        }
        console.log(barrel);
    }

    /**
     * The update cycle.This is controlling the movement
     */
    public update(): void {
        //  const currentTile = this.island.getTileAtWorldXY(this.pirate.x, this.pirate.y);
        const treasure_tile = this.holes.getTileAtWorldXY(this.XmarksTheSpot.x, this.XmarksTheSpot.y);

        const holeTile = this.holes.getTileAtWorldXY(this.pirate.getBottomCenter().x, this.pirate.getBottomCenter().y);
        this.pirate.setVelocityX(0);

        if (this.digging) {
            this.pirate.play("pirateDig", true);
            this.digwait = 0;
            this.frontDust.setVisible(true);
            this.frontDust.play("frontDust", true);
            this.rearDust.setVisible(true);
            this.rearDust.play("rearDust", true);

            if (!this.digSound.isPlaying) {
                this.digSound.play();
            }

            if (this.digtime++ >= Pirate.DIGTIME) {
                this.digging = false;
                this.digtime = 0;
                this.pirate.play("pirateWalk", true);
                this.frontDust.setVisible(false);
                this.rearDust.setVisible(false);
                if (holeTile) {
                    holeTile.setVisible(true);
                }

                if (holeTile && treasure_tile && holeTile.x === treasure_tile.x && holeTile.y === treasure_tile.y) {
                    MainEventsManager.emit("GameWon");
                    console.log("Won game");
                }
            }
        } else {
            if (this.leftMove) this.pirate.flipX = true;
            if (this.rightMove) this.pirate.flipX = false;

            if (this.leftMove || this.rightMove || this.upMove || this.downMove) {
                this.pirate.play("pirateWalk", true);
                if (!this.walkSound.isPlaying) {
                    this.walkSound.play();
                }
                this.digwait = 0;
            } else {
                if (holeTile && !holeTile.visible && this.digwait++ >= Pirate.DIGWAIT) {
                    this.digging = true;
                }

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
            //d this.debugText.setPosition(this.pirate.x, this.pirate.y);
            // if (currentTile) {
            //     this.debugText.setText("" + currentTile.canCollide + " " + PirateTile[currentTile.index]);
            // } else {
            //     this.debugText.setText("null");
            // }
            this.pirate.depth = this.pirate.getBottomCenter().y;
            this.frontDust.setPosition(this.pirate.x, this.pirate.y + 70);
            this.frontDust.depth = this.pirate.depth + 1;
            this.rearDust.setPosition(this.pirate.x, this.pirate.y + 50);
            this.rearDust.depth = this.pirate.depth - 1;
        }
        MainEventsManager.emit("playerXY", this.controls, this.pirate.getCenter().x, this.pirate.getCenter().y);
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
