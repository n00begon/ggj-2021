import { GameSettings } from "../../utilities/GameSettings";
import { PuzzlePieces } from "./PuzzlePieces";

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

        this.backgroundRect = this.build_rect(
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
                this.rects[i][j] = this.build_rect(
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

    private build_rect(
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
}
