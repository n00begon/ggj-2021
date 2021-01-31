import { UIManager } from "./puzzle/UIManager";

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
    }

    /**
     * Create is called when the scene is loaded
     */
    public create(): void {
        this.uiMan = new UIManager(this);
    }
}
