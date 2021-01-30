import { ScoreText } from "./ScoreText";
import { MainEventsManager } from "./MainEventsManager";

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private scoreTextWASD: ScoreText;
    private scoreTextArrows: ScoreText;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        MainEventsManager.on("scoreChange", this.handleScoreChange, this);

        this.scoreTextWASD = new ScoreText(scene, 30, 30);
        this.scoreTextWASD.update(0);

        this.scoreTextArrows = new ScoreText(scene, 800, 30);
        this.scoreTextArrows.update(0);
    }

    /**
     * Handles score change by updating the score UI text
     * @param amount - the amount the score is now
     */
    private handleScoreChange(amount: number): void {
        this.scoreTextWASD.update(amount);
    }

    public showPuzzleForArrows(): void {
        this.scoreTextArrows.update(200);
    }

    public hidePuzzleForArrows(): void {
        this.scoreTextArrows.hide();
    }

    public showPuzzleForWASD(): void {
        this.scoreTextWASD.update(100);
    }

    public hidePuzzleForWASD(): void {
        this.scoreTextWASD.hide();
    }
}
