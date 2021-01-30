/**
 * Audio manager controls adding audio to the scene and the background music
 */
export class AudioManager {
    /**
     * Adds the audio to the scene and starts the background music
     */
    constructor(scene: Phaser.Scene) {
        scene.sound.stopAll();
        scene.sound.add("walking1");
        const backgroundMusic = scene.sound.add("the-buccaneers-haul");
        backgroundMusic.play({
            loop: true,
            volume: 0.3,
        });
    }
}
