import { GameSettings } from "../utilities/GameSettings";
import { TypewriterText } from "../utilities/text/TypewriterText";
import { InstructionEventsManager } from "./InstructionEventsManager";
export class InstructionText {
    private textList = new Array<TypewriterText>(2);
    private countdown: number;

    constructor(scene: Phaser.Scene) {
        this.countdown = 5000;
        const top = 200;
        const wait = 100;
        const defaultHeight = 960;
        const scale = scene.game.canvas.height / defaultHeight;
        let order = 0;
        this.textList.push(
            new TypewriterText(
                scene,
                "Find the Treasure!",
                (top - 60) / defaultHeight,
                wait * order++,
                GameSettings.LARGE_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Break barrels to find map pieces",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Stand still to dig",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Escape with the Treasure",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Player 1 Up Down Left Right Space",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Player 2 WASD E",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Player 3 & 4 Gamepad",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),

            new TypewriterText(
                scene,
                "Click to start",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                InstructionEventsManager,
            ),
        );
    }

    public update(): boolean {
        let finished = false;
        this.textList.forEach((displayText) => {
            finished = displayText.update();
        });

        return finished;
    }
}
