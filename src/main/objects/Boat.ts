import { GameSettings } from "../../utilities/GameSettings";
import { MainEventsManager } from "../MainEventsManager";
import { Pirate } from "./Pirate";

export class Boat {
    public boat: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        pirateA: Pirate,
        pirateB: Pirate,
        pirateC: Pirate,
        pirateD: Pirate,
    ) {
        this.scene = scene;
        this.boat = scene.physics.add.sprite(x, y, "sprites", "Boat");
        this.boat.depth = 1;
        this.addCollider(scene, pirateA);
        this.addCollider(scene, pirateB);
        this.addCollider(scene, pirateC);
        this.addCollider(scene, pirateD);
    }

    private addCollider(scene: Phaser.Scene, pirate: Pirate) {
        scene.physics.add.overlap(this.boat, pirate.getSprite(), () => {
            if (pirate.hasTreasure && GameSettings.chasing) {
                MainEventsManager.emit("GameWon");
            }
        });
    }
}
