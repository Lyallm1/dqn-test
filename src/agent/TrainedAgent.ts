import * as tf from '@tensorflow/tfjs';

import { DequeBuffer } from '../experimental/DequeBuffer.js';

export class TrainedAgent {
  private predictModel: tf.LayersModel;
  buffer = new DequeBuffer(50000);
  training = false;
  epsilon = 1;
  epsilonDecay = 0.9999999;
  score = 0;
  epsilonStrategy = true;
  updateEvery = 100;
  toUpdate = 0;

  constructor(public model: string) {}

  async init() {
    this.predictModel = await tf.loadLayersModel('https://kastanx.github.io/dqn-test/' + this.model + '/model.json');
    console.log('loaded');
  }

  async train() {}

  predict(state: any) {
    console.log('SCORE: ' + this.score);
    const qs = (this.predictModel.predict(tf.tensor2d([state])) as tf.Tensor).dataSync();
    return parseInt(Object.keys(qs).reduce((a, b) => qs[a] > qs[b] ? a : b)) + 1;
  }

  updateModel() {}
}
