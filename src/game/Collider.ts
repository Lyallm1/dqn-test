import { GameEntity } from './GameEntity.js';

interface Collide {
  entities1: GameEntity[];
  entities2: GameEntity[];
  callback: (o1: GameEntity, o2: GameEntity) => void;
}

export class Collider {
  private map: Collide[] = [];

  add(entities1: GameEntity[], entities2: GameEntity[], callback: (o1: GameEntity, o2: GameEntity) => void) {
    this.map.push({ entities1, entities2, callback });
  }

  check() {
    const collidees: Collide[][] = [];
    this.map.forEach((collide, index) => {
      collidees[index] = [];
      collide.entities1.forEach(element => collidees[index][element.getStringPosititon()] = element);
      collide.entities2.forEach(element => {
        if (element.getStringPosititon() in collidees[index]) collide.callback(collidees[index][element.getStringPosititon()], element);
      });
    });
  }

  reset() {
    this.map = [];
  }
}
