import { GameSettings } from "../utilities/GameSettings";
import { TypewriterText } from "../utilities/text/TypewriterText";
import { InstructionEventsManager } from "./InstructionEventsManager";
export class InstructionText {
    private textList = new Array<TypewriterText>(2);
    private countdown: number;

    constructor(scene: Phaser.Scene) {
        this.countdown = GameSettings.END_SCENE_TIME;
        const top = 200;
        const wait = 100;
        const defaultHeight = 960;
        const scale = scene.game.canvas.height / defaultHeight;
        const order = 0;
        this.textList.push(
            new TypewriterText(
                scene,
                "Find the Treasure!",
                (top - 60) / defaultHeight,
                wait * order,
                GameSettings.LARGE_FONT_SIZE * scale,
                InstructionEventsManager,
            ),
        );
    }

    public update(): boolean {
        let finished = false;
        this.textList.forEach((displayText) => {
            finished = displayText.update();
        });

        return finished && this.countdown-- <= 0;
    }
}
