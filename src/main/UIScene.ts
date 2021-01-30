import { UIManager } from "./UIManager";
import { MainEventsManager } from "./MainEventsManager";

/**
 * UI is a scene overlayed on the main scene to hold all the user interface components
 */
export class UI extends Phaser.Scene {
    /**
     * The constructor sets the scene ID
     */
    public constructor() {
        super("UI");
        MainEventsManager.on("showPuzzle", this.handleShowPuzzle, this);
        MainEventsManager.on("dontShowPuzzle", this.handleDontShowPuzzle, this);
    }

    /**
     * Create is called when the scene is loaded
     */
    public create(): void {
        new UIManager(this);
    }

    private handleShowPuzzle(): void {
        this.scene.setVisible(true);
    }

    private handleDontShowPuzzle(): void {
        this.scene.setVisible(false);
    }
}
