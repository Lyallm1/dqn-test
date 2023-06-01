import { GarbageMan } from './GarbageMan.js';
import { TakenSpots } from './TakenSpots.js';
import { random } from 'lodash';

export class GarbageManFactory {
  static create(count: number, gameWidth: number, gameHeight: number, context: CanvasRenderingContext2D, takenSpots: TakenSpots) {
    const garbageMan: GarbageMan[] = [];
    for (let i = 0; i < count; i++) {
      const position = GarbageManFactory.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);
      garbageMan.push(new GarbageMan(1, 1, parseInt(position.split(',')[0]), parseInt(position.split(',')[1]), context, 'blue'));
    }
    return garbageMan;
  }

  static generateUnique(gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;
    return takenSpots.all().find(pos => pos === position) ? this.generateUnique(gameWidth, gameHeight, takenSpots) : position;
  }
}
