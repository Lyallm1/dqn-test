import { sample } from 'lodash';

export class Action {
  static UP = 1;
  static DOWN = 2;
  static LEFT = 3;
  static RIGHT = 4;

  static toArray() {
    return Object.values(Action).filter(value => typeof value === 'number');
  }

  static random(actions?: number[]) {
    return sample(actions && actions.length > 0 ? actions : this.toArray());
  }
}
