import { Position } from './Position.js';
import { Px } from '../util/Px.js';

export class GameEntity {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

  constructor(width: number, height: number, x: number, y: number, protected context: CanvasRenderingContext2D, protected color: string) {
    this.x = Px.scaleUp(x);
    this.y = Px.scaleUp(y);
    this.width = Px.scaleUp(width);
    this.height = Px.scaleUp(height);
  }

  getX() { return Px.scaleDown(this.x); }
  setX(x: number) { this.x = Px.scaleUp(x); }

  getY() { return Px.scaleDown(this.y); }
  setY(y: number) { this.y = Px.scaleUp(y); }

  getPosition() { return { x: Px.scaleDown(this.x), y: Px.scaleDown(this.y) }; }
  setPosition(position: Position) {
    this.x = Px.scaleUp(position.x);
    this.y = Px.scaleUp(position.y);
  }

  getContext() { return this.context; }
  setContext(context: CanvasRenderingContext2D)  { this.context = context; }

  getStringPosititon() {
    const pos = this.getPosition();
    return `${pos.x},${pos.y}`;
  }

  update() {
    this.getContext().fillStyle = this.color;
    this.getContext().fillRect(this.x, this.y, this.width, this.height);
  }

  delete() {}
}
