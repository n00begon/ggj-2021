import { GameSettings } from "../../utilities/GameSettings";
import { PuzzleMap } from "./PuzzleMap";

export class PuzzlePieces {
    public piece00: boolean;
    public piece10: boolean;
    public piece20: boolean;
    public piece01: boolean;
    public piece11: boolean;
    public piece21: boolean;
    public piece02: boolean;
    public piece12: boolean;
    public piece22: boolean;

    constructor() {
        this.piece00 = false;
        this.piece10 = false;
        this.piece20 = false;
        this.piece01 = false;
        this.piece11 = false;
        this.piece21 = false;
        this.piece02 = false;
        this.piece12 = false;
        this.piece22 = false;
    }

    public set(i: number, j: number): void {
        // HACK(Leon) : this sucks
        if (i == 0 && j == 0) {
            this.piece00 = true;
        } else if (i == 1 && j == 0) {
            this.piece10 = true;
        } else if (i == 2 && j == 0) {
            this.piece20 = true;
        } else if (i == 0 && j == 1) {
            this.piece01 = true;
        } else if (i == 1 && j == 1) {
            this.piece11 = true;
        } else if (i == 2 && j == 1) {
            this.piece21 = true;
        } else if (i == 0 && j == 2) {
            this.piece02 = true;
        } else if (i == 1 && j == 2) {
            this.piece12 = true;
        } else if (i == 2 && j == 2) {
            this.piece22 = true;
        }
    }

    public havePiece(i: number, j: number): boolean {
        // HACK(Leon) : this sucks
        if (i == 0 && j == 0) {
            return this.piece00;
        } else if (i == 1 && j == 0) {
            return this.piece10;
        } else if (i == 2 && j == 0) {
            return this.piece20;
        } else if (i == 0 && j == 1) {
            return this.piece01;
        } else if (i == 1 && j == 1) {
            return this.piece11;
        } else if (i == 2 && j == 1) {
            return this.piece21;
        } else if (i == 0 && j == 2) {
            return this.piece02;
        } else if (i == 1 && j == 2) {
            return this.piece12;
        } else if (i == 2 && j == 2) {
            return this.piece22;
        }

        return false;
    }
}

function build_rect(
    scene: Phaser.Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
): Phaser.GameObjects.Rectangle {
    const cx = x + w / 2.0;
    const cy = y + h / 2.0;

    return scene.add.rectangle(cx, cy, w, h, color);
}

export class PuzzleHUD {
    public x: number;
    public y: number;
    public rects: Phaser.GameObjects.Rectangle[][];
    public backgroundRect: Phaser.GameObjects.Rectangle;
    public playerPosRect: Phaser.GameObjects.Image;
    public treasurePosRect: Phaser.GameObjects.Image;
    static readonly TILE_WIDTH = 64;
    static readonly TILE_HEIGHT = 64;
    static readonly DIM_X = 3;
    static readonly DIM_Y = 3;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.x = x;
        this.y = y;
        const c = 0x908e7e;
        const colors = [c, c, c, c, c, c, c, c, c];

        this.backgroundRect = build_rect(
            scene,
            this.x,
            this.y,
            PuzzleHUD.TILE_WIDTH * 3,
            PuzzleHUD.TILE_HEIGHT * 3,
            0x000000,
        );

        this.rects = [];
        for (let i = 0; i < PuzzleHUD.DIM_X; i++) {
            this.rects[i] = [];
            for (let j = 0; j < PuzzleHUD.DIM_Y; j++) {
                const ci = j * PuzzleHUD.DIM_Y + i;
                this.rects[i][j] = build_rect(
                    scene,
                    this.x + i * PuzzleHUD.TILE_WIDTH,
                    this.y + j * PuzzleHUD.TILE_HEIGHT,
                    PuzzleHUD.TILE_WIDTH,
                    PuzzleHUD.TILE_HEIGHT,
                    colors[ci],
                );
            }
        }

        this.treasurePosRect = scene.add.image(0, 0, "sprites", "Treasure Chest");
        this.treasurePosRect.scale = 0.1;

        this.playerPosRect = scene.add.image(0, 0, "sprites", "Faceonly");
        this.playerPosRect.scale = 0.4;
    }

    public world_space_to_HUD_space(wx: number, wy: number): Phaser.Math.Vector2 {
        const x01 = wx / GameSettings.MAP_WIDTH;
        const y01 = wy / GameSettings.MAP_HEIGHT;
        let ux = x01 * PuzzleHUD.DIM_X * PuzzleHUD.TILE_WIDTH;
        let uy = y01 * PuzzleHUD.DIM_Y * PuzzleHUD.TILE_HEIGHT;
        ux += this.x;
        uy += this.y;
        return new Phaser.Math.Vector2(ux, uy);
    }

    public updateTreasurePos(wx: number, wy: number): void {
        const xy = this.world_space_to_HUD_space(wx, wy);
        this.treasurePosRect.setPosition(xy.x, xy.y);
    }

    public updatePlayerPos(wx: number, wy: number): void {
        const xy = this.world_space_to_HUD_space(wx, wy);
        this.playerPosRect.setPosition(xy.x, xy.y);
    }

    public hide(): void {
        for (let i = 0; i < PuzzleHUD.DIM_X; i++) {
            for (let j = 0; j < PuzzleHUD.DIM_Y; j++) {
                this.rects[j][i].visible = false;
            }
        }

        this.backgroundRect.visible = false;
        this.playerPosRect.visible = false;
        this.treasurePosRect.visible = false;
    }

    public show(pieces: PuzzlePieces): void {
        for (let i = 0; i < PuzzleHUD.DIM_X; i++) {
            for (let j = 0; j < PuzzleHUD.DIM_Y; j++) {
                if (pieces.havePiece(i, j)) {
                    this.rects[j][i].visible = true;
                }
            }
        }

        this.backgroundRect.visible = true;
        this.playerPosRect.visible = true;

        // ONLY IF you have that puzzle piece
        const dx = PuzzleHUD.TILE_WIDTH;
        const dy = PuzzleHUD.TILE_HEIGHT;
        const cxy = this.treasurePosRect.getCenter();
        const ax = Math.floor(cxy.x / dx) - 1;
        const ay = Math.floor(cxy.y / dy) - 1;

        if (pieces.havePiece(ax, ay)) {
            this.treasurePosRect.visible = true;
        }
    }
}

/**
 * UIManager controls the user interface elements displayed to the user
 */
export class UIManager {
    private maps: Array<PuzzleMap> = new Array<PuzzleMap>(2);
    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        this.maps.push(new PuzzleMap(scene, 64, 64, 1));
        this.maps.push(new PuzzleMap(scene, 800, 64, 2));
    }
}
