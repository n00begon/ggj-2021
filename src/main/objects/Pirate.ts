import { GameSettings } from "../../utilities/GameSettings";
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
    private digwait = 0;
    private digtime = 0;
    private digging = false;
    private frontDust: Phaser.GameObjects.Sprite;
    private rearDust: Phaser.GameObjects.Sprite;
    private XmarksTheSpot: Phaser.Math.Vector2;
    private player: number;
    public hasTreasure = false;
    public stunned = false;
    /**
     * Creates the pirate object
     *
     * @param scene - the phaser scene to add the object to
     * @param x - the x position where pirate will start
     * @param y - the y position where pirate will start
     */
    constructor(
        scene: Phaser.Scene,
        player: number,
        x: number,
        y: number,
        collisionLayer: Phaser.Tilemaps.TilemapLayer,
        holeLayer: Phaser.Tilemaps.TilemapLayer,
        XmarksTheSpot: Phaser.Math.Vector2,
    ) {
        this.scene = scene;
        this.player = player;
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
        collisionLayer.setCollision(PirateTile.Rock);

        MainEventsManager.on("leftMove" + player, this.handleLeftMove, this);
        MainEventsManager.on("rightMove" + player, this.handleRightMove, this);
        MainEventsManager.on("upMove" + player, this.handleUpMove, this);
        MainEventsManager.on("downMove" + player, this.handleDownMove, this);
    }

    public getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.pirate;
    }

    public receivedBarrel(barrel: Barrel): void {
        if (barrel.isPuzzlePiece) {
            MainEventsManager.emit("foundPuzzle", this.player, barrel.puzzleX, barrel.puzzleY);
        }
    }

    private stun(): void {
        this.stunned = true;
        this.pirate.play("pirateStunned");
        this.pirate.once("animationcomplete", () => {
            this.stunned = false;
            this.pirate.play("pirateWalk");
        });
    }

    private static passTreasure(pirateFrom: Pirate, pirateTo: Pirate): void {
        pirateFrom.stun();
        pirateFrom.hasTreasure = false;
        pirateTo.hasTreasure = true;
        pirateTo.pirate.play("pirateTreasureWalk");
    }

    public addCollider(scene: Phaser.Scene, anotherPirate: Pirate): void {
        scene.physics.add.overlap(this.pirate, anotherPirate.getSprite(), () => {
            if (GameSettings.chasing && !this.stunned && !anotherPirate.stunned) {
                if (this.hasTreasure) {
                    Pirate.passTreasure(this, anotherPirate);
                } else if (anotherPirate.hasTreasure) {
                    Pirate.passTreasure(anotherPirate, this);
                }
            }
        });
    }

    /**
     * The update cycle.This is controlling the movement
     */
    public update(): void {
        //  const currentTile = this.island.getTileAtWorldXY(this.pirate.x, this.pirate.y);
        const treasure_tile = this.holes.getTileAtWorldXY(this.XmarksTheSpot.x, this.XmarksTheSpot.y);

        const holeTile = this.holes.getTileAtWorldXY(this.pirate.getBottomCenter().x, this.pirate.getBottomCenter().y);
        this.pirate.setVelocityX(0);
        this.pirate.setVelocityY(0);

        if (this.stunned) {
            return;
        }

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
                this.pirate.play(this.hasTreasure ? "pirateTreasureWalk" : "pirateWalk", true);
                this.frontDust.setVisible(false);
                this.rearDust.setVisible(false);
                if (holeTile) {
                    holeTile.setVisible(true);
                }

                if (holeTile && treasure_tile && holeTile.x === treasure_tile.x && holeTile.y === treasure_tile.y) {
                    GameSettings.chasing = true;
                    this.hasTreasure = true;
                    this.pirate.play("pirateTreasureWalk");
                    console.log("Won game");
                    // MainEventsManager.emit("GameWon");
                }
            }
        } else {
            if (this.leftMove) this.pirate.flipX = true;
            if (this.rightMove) this.pirate.flipX = false;

            if (this.leftMove || this.rightMove || this.upMove || this.downMove) {
                this.pirate.play(this.hasTreasure ? "pirateTreasureWalk" : "pirateWalk", true);
                if (!this.walkSound.isPlaying) {
                    this.walkSound.play();
                }
                this.digwait = 0;
            } else {
                if (holeTile && !holeTile.visible && this.digwait++ >= Pirate.DIGWAIT && !GameSettings.chasing) {
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
        MainEventsManager.emit("playerXY" + this.player, this.pirate.getCenter().x, this.pirate.getCenter().y);
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
