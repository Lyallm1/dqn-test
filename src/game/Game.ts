import { Action } from './Action.js';
import { Collider } from './Collider.js';
import { EntityType } from './EntityType.js';
import { Frame } from '../experimental/DequeBuffer.js';
import { GameEntity } from './GameEntity.js';
import { GarbageMan } from './GarbageMan.js';
import { GarbageManFactory } from './GarbageManFactory.js';
import { Obstacle } from './Obstacle.js';
import { ObstacleFactory } from './ObstacleFactory.js';
import { Px } from '../util/Px.js';
import { Reward } from './Reward.js';
import { TakenSpots } from './TakenSpots.js';
import { Trash } from './Trash.js';
import { TrashFactory } from './TrashFactory.js';

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private fence: Obstacle[];
  private obstacles: Obstacle[];
  private trash: Trash[];
  private garbageMan: GarbageMan;
  private collider = new Collider();
  endGameCallback?: (o1: GameEntity, o2: GameEntity) => void;
  successCallback?: (o1: GameEntity, o2: GameEntity) => void;
  state: any;
  reward: number;

  constructor(canvasId: string, private gameWidth: number, private gameHeight: number, public render: boolean, public staticWorld: boolean) {
    if (this.render) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.canvas.width = Px.scaleUp(gameWidth);
      this.canvas.height = Px.scaleUp(gameHeight);
      this.context = this.canvas.getContext('2d');
    }
  }

  reset() {
    this.clear();
    this.collider.reset();
  }

  start() {
    this.reset();
    const takenSpots = new TakenSpots();
    this.fence = ObstacleFactory.generateFence(this.gameWidth, this.gameHeight, this.context, takenSpots);
    this.obstacles = this.staticWorld ? ObstacleFactory.createStatic(this.context, takenSpots) : ObstacleFactory.create(5, this.gameWidth, this.gameHeight, this.context, takenSpots);
    this.trash = this.staticWorld ? TrashFactory.createStatic(this.context, takenSpots) : TrashFactory.create(5, this.gameWidth, this.gameHeight, this.context, takenSpots);
    this.garbageMan = GarbageManFactory.create(1, this.gameWidth, this.gameHeight, this.context, takenSpots)[0];
    this.collider.add([this.garbageMan], this.obstacles.concat(this.fence), (o1, o2) => {
      this.reward = Reward.OBSTACLE;
      this.endGameCallback(o1, o2);
    });
    this.collider.add([this.garbageMan], this.trash, (o1, o2) => {
      this.reward = Reward.TRASH;
      this.successCallback(o1, o2);
    });
    if (this.render) {
      this.garbageMan.update();
      this.obstacles.forEach(element => element.update());
      this.fence.forEach(element => element.update());
      this.trash.forEach(element => element.update());
    }
  }

  getState() {
    const map = {};
    this.obstacles.forEach(el => map[el.getStringPosititon()] = el.getType());
    this.fence.forEach(el => map[el.getStringPosititon()] = el.getType());
    this.trash.forEach(el => !el.removed ? (map[el.getStringPosititon()] = el.getType()) : '');
    map[this.garbageMan.getStringPosititon()] = this.garbageMan.getType();
    for (let x = 0; x < this.gameWidth; x++) for (let y = 0; y < this.gameHeight; y++) if (!(map[`${x},${y}`] == EntityType.TRASH || map[`${x},${y}`] == EntityType.OBSTACLE || map[`${x},${y}`] == EntityType.ME)) map[`${x},${y}`] = EntityType.VOID;
    return Object.values(Object.keys(map).sort()).map(parseInt);
  }

  clear() {
    if (this.render) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    if (this.render) {
      this.clear();
      this.obstacles.forEach(element => element.update());
      this.fence.forEach(element => element.update());
      this.trash.forEach(element => element.update());
      this.garbageMan.update();
    }
    this.collider.check();
  }

  move(action: number) {
    this.garbageMan.execute(action);
    this.update();
  }

  createControls() {
    if (this.render) document.onkeydown = e => {
      switch (e.keyCode) {
        case 38: this.move(Action.UP); break;
        case 40: this.move(Action.DOWN); break;
        case 37: this.move(Action.LEFT); break;
        case 39: this.move(Action.RIGHT); break;
        default: break
      }
    };
  }

  step(action: number) {
    this.reward = Reward.WALK;
    const state = this.getState();
    this.move(action);
    return { state, action, nextState: this.getState(), reward: this.reward } as Frame;
  }
}
