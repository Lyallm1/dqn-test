export class Px {
  static pxInSquare = 10;

  static scaleUp(pixels: number): number {
    return pixels * this.pxInSquare;
  }

  static scaleDown(square: number): number {
    return square / this.pxInSquare;
  }
}
