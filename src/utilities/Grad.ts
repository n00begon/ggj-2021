export class Grad {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }

    public dot3(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
}
