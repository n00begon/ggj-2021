import { MainEventsManager } from "./MainEventsManager";
/**
 * ControlManager collects interactions with the player and emits them as events.
 * This lets things that need to end up as the same action be mapped to different keys
 */
export class ControlManager {
    private static readonly PAD_THRESHOLD = 0.1;

    private jumpKey2: Phaser.Input.Keyboard.Key;

    private leftKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private upKey: Phaser.Input.Keyboard.Key;
    private downKey: Phaser.Input.Keyboard.Key;
    private showPuzzleKey: Phaser.Input.Keyboard.Key;

    private leftKey2: Phaser.Input.Keyboard.Key;
    private rightKey2: Phaser.Input.Keyboard.Key;
    private upKey2: Phaser.Input.Keyboard.Key;
    private downKey2: Phaser.Input.Keyboard.Key;
    private showPuzzleKey2: Phaser.Input.Keyboard.Key;

    private DEBUGaddPuzzle00Key: Phaser.Input.Keyboard.Key;
    private DEBUGaddPuzzle11Key: Phaser.Input.Keyboard.Key;

    private currentPointer!: Phaser.Input.Pointer | null;

    private scene: Phaser.Scene;
    /**
     * Record all the keys which the user can use
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.jumpKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.showPuzzleKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.leftKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.upKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.showPuzzleKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACK_SLASH);

        this.DEBUGaddPuzzle00Key = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN);
        this.DEBUGaddPuzzle11Key = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);

        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.currentPointer = pointer;
        });

        scene.input.on("pointerup", () => {
            this.currentPointer = null;
        });
    }

    /**
     * Checks what keys are down this update cycle and emits events based on it.
     */
    update(): void {
        this.keyboardInput();
        this.mouseInput();
        this.gamepadInput();
    }

    private keyboardInput() {
        if (this.leftKey.isDown) {
            MainEventsManager.emit("leftMove");
        }

        if (this.rightKey.isDown) {
            MainEventsManager.emit("rightMove");
        }

        if (this.upKey.isDown) {
            MainEventsManager.emit("upMove");
        }

        if (this.downKey.isDown) {
            MainEventsManager.emit("downMove");
        }

        // NOTE(Leon) : doing this the straight forward way of setting scene to insivisle
        // at end of each frame and then turning on if puzzle key pressed didn't work
        // so now emitting a dont show puzzle event as well.
        // i dunno
        if (this.showPuzzleKey.isDown) {
            MainEventsManager.emit("showPuzzleWASD");
        } else {
            MainEventsManager.emit("dontShowPuzzleWASD");
        }

        if (this.leftKey2.isDown) {
            MainEventsManager.emit("leftMove2");
        }

        if (this.rightKey2.isDown) {
            MainEventsManager.emit("rightMove2");
        }

        if (this.upKey2.isDown) {
            MainEventsManager.emit("upMove2");
        }

        if (this.downKey2.isDown) {
            MainEventsManager.emit("downMove2");
        }

        if (this.showPuzzleKey2.isDown) {
            MainEventsManager.emit("showPuzzleArrows");
        } else {
            MainEventsManager.emit("dontShowPuzzleArrows");
        }

        if (this.DEBUGaddPuzzle00Key.isDown) {
            MainEventsManager.emit("foundPuzzle", 0, 0);
        }

        if (this.DEBUGaddPuzzle11Key.isDown) {
            MainEventsManager.emit("foundPuzzle", 1, 1);
        }
    }

    private mouseInput() {
        if (this.currentPointer?.isDown) {
            if (this.currentPointer.x < this.scene.cameras.main.displayWidth / 2) {
                MainEventsManager.emit("leftMove3");
            } else {
                MainEventsManager.emit("rightMove3");
            }

            if (this.currentPointer.y < this.scene.cameras.main.displayHeight / 2) {
                MainEventsManager.emit("upMove3");
            } else {
                MainEventsManager.emit("downMove3");
            }
        }
    }

    private gamepadInput() {
        if (this.scene.input.gamepad.total === 0) {
            return;
        }

        // Get the first gamepad
        const pad = this.scene.input.gamepad.gamepads[0];

        // Every button is jump
        if (pad.buttons[0].pressed) {
            MainEventsManager.emit("jumpMove");
        }

        const xMovement = pad.leftStick.x;

        // Stick

        if (xMovement < -ControlManager.PAD_THRESHOLD) {
            MainEventsManager.emit("leftMove");
        } else if (xMovement > ControlManager.PAD_THRESHOLD) {
            MainEventsManager.emit("rightMove");
        }

        // DPad

        if (pad.left) {
            MainEventsManager.emit("leftMove");
        }

        if (pad.right) {
            MainEventsManager.emit("rightMove");
        }
    }
}
