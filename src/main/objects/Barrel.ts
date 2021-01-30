import { Pirate } from "./Pirate";

export class Barrel {
    public barrel: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private broken = false;
    private isCrate = false;
    public isPuzzlePiece = false;
    public puzzleX = 0;
    public puzzleY = 0;

    private explodeSound: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number, pirateA: Pirate, pirateB: Pirate) {
        this.scene = scene;
        this.isCrate = Math.random() < 0.5;
        this.barrel = scene.physics.add.sprite(
            x,
            y,
            "sprites",
            this.isCrate ? "Crate Exploding Artboards-01" : "Barrel-01",
        );
        this.barrel.depth = this.barrel.getBottomCenter().y;
        this.barrel.setImmovable(true);
        this.addCollider(scene, pirateA);
        this.addCollider(scene, pirateB);

        this.explodeSound = scene.sound.get("explode");
    }

    private addCollider(scene: Phaser.Scene, pirate: Pirate) {
        scene.physics.add.collider(this.barrel, pirate.getSprite(), () => {
            if (!this.broken) {
                pirate.receivedBarrel(this);
                this.broken = true;
                this.barrel.disableBody();
                this.barrel.playAfterDelay(this.isCrate ? "crateExplode" : "barrelExplode", 200);

                if (!this.explodeSound.isPlaying) {
                    this.explodeSound.play();
                }

                this.barrel.once("animationcomplete", () => {
                    this.barrel.setVisible(false);
                    this.barrel.setActive(false);
                });
            }
        });
    }
}
