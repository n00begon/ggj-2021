/**
 * Pirate is the character that the player controls.
 */
export class Barrel {
    public barrel: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.barrel = scene.physics.add.staticImage(x, y, "sprites", "barrel");

        // scene.physics.add.collider(this.barrel, collisionLayer);
        // collisionLayer.setCollision(PirateTile.Water);
    }
}
