import { UIManager } from "./UIManager";
import { MainEventsManager } from "./MainEventsManager";

/**
 * UI is a scene overlayed on the main scene to hold all the user interface components
 */
export class UI extends Phaser.Scene {
    private uiMan!: UIManager;
    /**
     * The constructor sets the scene ID
     */
    public constructor() {
        super("UI");
        MainEventsManager.on("showPuzzleWASD", this.handleShowPuzzleWASD, this);
        MainEventsManager.on("dontShowPuzzleWASD", this.handleDontShowPuzzleWASD, this);

        MainEventsManager.on("showPuzzleArrows", this.handleShowPuzzleArrows, this);
        MainEventsManager.on("dontShowPuzzleArrows", this.handleDontShowPuzzleArrows, this);
    }

    /**
     * Create is called when the scene is loaded
     */
    public create(): void {
        this.uiMan = new UIManager(this);
    }

    private handleShowPuzzleWASD(): void {
        this.uiMan.showPuzzleForWASD();
    }

    private handleDontShowPuzzleWASD(): void {
        this.uiMan.hidePuzzleForWASD();
    }

    private handleShowPuzzleArrows(): void {
        this.uiMan.showPuzzleForArrows();
    }

    private handleDontShowPuzzleArrows(): void {
        this.uiMan.hidePuzzleForArrows();
    }
}
