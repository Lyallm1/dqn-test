import { Action } from './Action.js';
import { EntityType } from './EntityType.js';
import { GameEntity } from './GameEntity.js';

export class GarbageMan extends GameEntity {
  getType() {
    return EntityType.ME;
  }

  execute(action: number) {
    switch (action) {
      case Action.LEFT: this.x -= this.width; break;
      case Action.RIGHT: this.x += this.width; break;
      case Action.UP: this.y -= this.height; break;
      case Action.DOWN: this.y += this.height; break;
    }
  }
}
