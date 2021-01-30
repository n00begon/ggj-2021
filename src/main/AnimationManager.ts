/**
 * Animation Manager creates all the animations to be used by the sprites.
 */
export class AnimationManager {
    /**
     * Creates the animations for the game objects so that they are only created once
     */
    constructor(scene: Phaser.Scene) {
        this.createWalkAnimation(scene);
        this.createDigAnimation(scene);
    }

    private createWalkAnimation(scene: Phaser.Scene): void {
        scene.anims.create({
            frameRate: 6,
            frames: scene.anims.generateFrameNames("sprites", {
                start: 1,
                end: 4,
                prefix: "pirate_walk_",
            }),

            key: "pirateWalk",
            repeat: -1,
        });
    }

    private createDigAnimation(scene: Phaser.Scene): void {
        scene.anims.create({
            frameRate: 6,
            frames: scene.anims.generateFrameNames("sprites", {
                start: 1,
                end: 4,
                prefix: "PirateBasicDig",
            }),
            key: "pirateDig",
            repeat: -1,
        });
    }
}
