export class Barrel {
    public barrel: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.barrel = scene.physics.add.sprite(x, y, "sprites", "Barrel-01");
        this.setupCollisions(scene);
    }

    private collide(): void {
        console.log("collide");
    }

    private setupCollisions(scene: Phaser.Scene): void {
        scene.physics.world.on(
            "collisionstart",
            (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _event: any,
                bodyA: { gameObject: Phaser.Physics.Arcade.Sprite },
                bodyB: { gameObject: Phaser.Physics.Arcade.Sprite },
            ) => {
                if (bodyA.gameObject === this.barrel || bodyB.gameObject === this.barrel) {
                    this.collide();
                }
            },
        );
    }
}
