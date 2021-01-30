import { Pirate } from "./Pirate";

export class Barrel {
    public barrel: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private broken = false;

    constructor(scene: Phaser.Scene, x: number, y: number, pirateA: Pirate, pirateB: Pirate) {
        this.scene = scene;
        this.barrel = scene.physics.add.sprite(x, y, "sprites", "Barrel-01");
        this.barrel.depth = this.barrel.getBottomCenter().y;
        this.barrel.setImmovable(true);
        this.addCollider(scene, pirateA);
        this.addCollider(scene, pirateB);
    }

    private addCollider(scene: Phaser.Scene, pirate: Pirate) {
        scene.physics.add.collider(this.barrel, pirate.getSprite(), () => {
            if (!this.broken) {
                pirate.receivedBarrel(this);
                this.broken = true;
                this.barrel.disableBody();
                this.barrel.playAfterDelay("barrelExplode", 200);
                this.barrel.once("animationcomplete", () => {
                    this.barrel.setVisible(false);
                    this.barrel.setActive(false);
                });
            }
        });
    }
}
