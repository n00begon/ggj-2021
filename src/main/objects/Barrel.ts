import { GameSettings } from "../../utilities/GameSettings";
import { PlainText } from "../../utilities/text/PlainText";
import { PirateTile } from "../BackgroundManager";
import { KeyControls } from "../KeyControls";
import { MainEventsManager } from "../MainEventsManager";

/**
 * Pirate is the character that the player controls.
 */
export class Barrel {
    public barrel: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
    private scene: Phaser.Scene;
    // private debugText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        // this.barrel = scene.physics.add.sprite(x, y, "sprites", "barrel");
        this.barrel = scene.physics.add.staticImage(x, y, "barrel");

        // scene.physics.add.collider(this.pirate, collisionLayer);
        // collisionLayer.setCollision(PirateTile.Water);

        // this.debugText = scene.add.text(x, y, "Barrel", {
        //     fontFamily: GameSettings.DISPLAY_FONT,
        //     color: GameSettings.FONT_COLOUR,
        // });

        // this.debugText.setFontSize(50);
    }
}
