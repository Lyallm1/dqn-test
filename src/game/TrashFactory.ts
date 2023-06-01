import { TakenSpots } from './TakenSpots.js';
import { Trash } from './Trash.js';
import { random } from 'lodash';

export class TrashFactory {
  static createStatic(context: CanvasRenderingContext2D, takenSpots: TakenSpots) {
    const trash: Trash[] = [];
    ['5,5', '5,6', '3,2', '3,6', '4,1'].forEach(pos => {
      takenSpots.add(pos);
      trash.push(new Trash(1, 1, parseInt(pos.split(',')[0]), parseInt(pos.split(',')[1]), context, 'red'));
    });
    return trash;
  }

  static create(count: number, gameWidth: number, gameHeight: number, context: CanvasRenderingContext2D, takenSpots: TakenSpots): Trash[] {
    const trash: Trash[] = [];
    for (let i = 0; i < count; i++) {
      const position = this.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);
      trash.push(new Trash(1, 1, parseInt(position.split(',')[0]), parseInt(position.split(',')[1]), context, 'red'));
    }
    return trash;
  }

  static generateUnique(gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;
    return takenSpots.all().find(pos => pos === position) ? this.generateUnique(gameWidth, gameHeight, takenSpots) : position;
  }
}
