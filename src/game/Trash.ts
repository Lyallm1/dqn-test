import { EntityType } from './EntityType.js';
import { GameEntity } from './GameEntity.js';

export class Trash extends GameEntity {
  removed = false;

  getType() {
    return EntityType.TRASH;
  }

  delete() {
    this.setPosition({ x: -5000, y: -5000 });
    this.removed = true;
  }
}
