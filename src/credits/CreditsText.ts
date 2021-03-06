import { GameSettings } from "../utilities/GameSettings";
import { FadeText } from "../utilities/text/FadeText";
import { CreditsEventsManager } from "./CreditsEventsManager";
export class CreditsText {
    private textList = new Array<FadeText>(5);
    private countdown: number;

    constructor(scene: Phaser.Scene) {
        this.countdown = GameSettings.END_SCENE_TIME;

        const top = 200;
        const assets = 540;
        const wait = 100;
        const defaultHeight = 960;
        const scale = scene.game.canvas.height / defaultHeight;
        let order = 0;
        let assetsCount = 0;
        this.textList.push(
            new FadeText(
                scene,
                "Loot 'n' Scoot",
                (top - 60) / defaultHeight,
                wait * order++,
                GameSettings.LARGE_FONT_SIZE * scale,
                CreditsEventsManager,
            ),
        );

        this.textList.push(
            new FadeText(
                scene,
                "By Griff, John, Leon, Stepan and Tim",
                (top + 100 * order) / defaultHeight,
                wait * order++,
                80 * scale,
                CreditsEventsManager,
            ),
        );

        this.textList.push(
            new FadeText(
                scene,
                "Global Game Jam 2021",
                (assets + 100 * assetsCount++) / defaultHeight,
                wait * order++,
                GameSettings.MEDIUM_FONT_SIZE * scale,
                CreditsEventsManager,
            ),
        );

        this.textList.push(
            new FadeText(
                scene,
                "Click to play again",
                (assets + 300 * assetsCount++) / defaultHeight,
                wait * order++,
                GameSettings.SMALL_FONT_SIZE * scale,
                CreditsEventsManager,
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
