import * as tf from '@tensorflow/tfjs-node';

import { AggregateLayer } from '../AggregateLayer.js';

export class DuelingDqn {
  static create() {
    const input = tf.input({ shape: [64] }), hidden = tf.layers.dense({ units: 256, activation: 'relu' }).apply(tf.layers.dense({ units: 256, activation: 'relu' }).apply(input)),
    model = tf.model({ inputs: input, outputs: new AggregateLayer({}).apply([
      tf.layers.dense({ units: 4, activation: 'linear' }).apply(hidden) as tf.Tensor, tf.layers.dense({ units: 1, activation: 'linear' }).apply(hidden) as tf.Tensor
    ]) as tf.SymbolicTensor, name: 'dueling' });
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    model.summary();
    return model;
  }
}
