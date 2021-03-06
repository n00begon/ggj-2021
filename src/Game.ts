import "phaser";
import { Bootloader } from "./preloader/BootloaderScene'";
import { Preloader } from "./preloader/PreloaderScene";
import { Instruction } from "./instruction/InstructionScene";
import { Main } from "./main/MainScene";
import { End } from "./end/EndScene";
import { Credits } from "./credits/CreditsScene";

const config: Phaser.Types.Core.GameConfig = {
    width: 1640,
    height: 960,

    parent: "canvas",
    scene: [Bootloader, Preloader, Instruction, Main, End, Credits],
    type: Phaser.AUTO,

    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 },
            tileBias: 128,
        },
    },

    input: {
        gamepad: true,
    },

    scale: {
        mode: Phaser.Scale.RESIZE,
        width: "100%",
        height: "100%",
    },
};

new Phaser.Game(config);
