import { Pirate } from "./Pirate";

export class Barrel {
    public barrel: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number, pirateA: Pirate, pirateB: Pirate) {
        this.scene = scene;
        this.barrel = scene.physics.add.sprite(x, y, "sprites", "Barrel-01");
        this.barrel.depth = this.barrel.getBottomCenter().y;
        scene.physics.add.collider(this.barrel, pirateA.getSprite(), () => {
            console.log("YUM", pirateA);
            this.barrel.setVisible(false);
            this.barrel.setActive(false);
        });

        scene.physics.add.collider(this.barrel, pirateB.getSprite(), () => {
            console.log("YUM", pirateB);
            this.barrel.setVisible(false);
            this.barrel.setActive(false);
        });
    }
}
