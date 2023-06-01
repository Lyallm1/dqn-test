import { EntityType } from './EntityType.js';
import { GameEntity } from './GameEntity.js';

export class Obstacle extends GameEntity {
  getType() {
    return EntityType.OBSTACLE;
  }
}
