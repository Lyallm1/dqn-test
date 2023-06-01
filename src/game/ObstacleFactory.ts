import { Obstacle } from './Obstacle.js';
import { TakenSpots } from './TakenSpots.js';
import { random } from 'lodash';

export class ObstacleFactory {
  static createStatic(context: CanvasRenderingContext2D, takenSpots: TakenSpots) {
    const obstacles: Obstacle[] = [];
    ['1,5', '5,4', '6,4', '3,5', '4,6'].forEach(pos => {
      takenSpots.add(pos);
      obstacles.push(new Obstacle(1, 1, parseInt(pos.split(',')[0]), parseInt(pos.split(',')[1]), context, 'black'));
    });
    return obstacles;
  }

  static create(count: number, gameWidth: number, gameHeight: number, context: CanvasRenderingContext2D, takenSpots: TakenSpots): Obstacle[] {
    const obstacles: Obstacle[] = [];
    for (let i = 0; i < count; i++) {
      const position = ObstacleFactory.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);
      obstacles.push(new Obstacle(1, 1, parseInt(position.split(',')[0]), parseInt(position.split(',')[1]), context, 'black'));
    }
    return obstacles;
  }

  static generateUnique(gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;
    return takenSpots.all().find(pos => pos === position) ? this.generateUnique(gameWidth, gameHeight, takenSpots) : position;
  }

  static generateFence(gameWidth: number, gameHeight: number, context: CanvasRenderingContext2D, takenSpots: TakenSpots) {
    const obstacles: Obstacle[] = [];
    for (let x = 0; x < gameWidth; x++) {
      takenSpots.add(`${x},${0}`, `${x},${gameWidth - 1}`);
      obstacles.push(new Obstacle(1, 1, x, 0, context, 'black'), new Obstacle(1, 1, x, gameWidth - 1, context, 'black'));
    }
    for (let y = 0; y < gameHeight; y++) {
      takenSpots.add(`${0},${y}`, `${gameHeight - 1},${y}`);
      obstacles.push(new Obstacle(1, 1, 0, y, context, 'black'), new Obstacle(1, 1, gameHeight - 1, y, context, 'black'));
    }
    return obstacles;
  }
}
