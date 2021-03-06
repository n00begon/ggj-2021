import { InstructionEventsManager } from "./InstructionEventsManager";
import { InstructionText } from "./InstructionText";
/**
 */
export class Instruction extends Phaser.Scene {
    private static readonly NEXT_SCENE = "Main";
    private instructionText!: InstructionText;
    private ready = false;
    /**
     * The constructor sets the scene ID
     */
    public constructor() {
        super("Instruction");
    }

    /**
     * Sets the background colour for the scene
     */
    public preload(): void {
        this.cameras.main.setBackgroundColor("#000000");
    }

    /**
     * Create is called when the scene is loaded and sets up the Game End Text
     */
    public create(): void {
        this.instructionText = new InstructionText(this);
        this.scale.on("resize", this.resize);

        this.input.on("pointerdown", () => {
            if (this.ready) {
                this.scene.start(Instruction.NEXT_SCENE);
            }
        });

        this.sound.stopAll();

        const backgroundMusic = this.sound.add("shantypart1");
        backgroundMusic.play({
            loop: true,
            volume: 1,
        });
    }

    /**
     * The update loop gets the text to appear on screen
     */
    public update(): void {
        this.ready = this.instructionText.update();
    }

    /**
     * Resize gets called when the screen is resized. It fires off an event for the other
     * End objects to respond to
     *
     * @param gameSize - the new size of the screen
     */
    private resize(gameSize: Phaser.Structs.Size): void {
        InstructionEventsManager.emit("resize", gameSize);
    }
}
