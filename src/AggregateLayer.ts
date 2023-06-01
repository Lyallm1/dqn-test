import * as tf from '@tensorflow/tfjs-node'

export class AggregateLayer extends tf.layers.Layer {
  call(input: tf.Tensor[]) {
    return tf.tidy(() => input[1].add(input[0].sub(input[0].mean(1, true))));
  }

  static get className() { return 'AggregateLayer'; }

  computeOutputShape() {
    return [1, 4];
  }
}

tf.serialization.registerClass(AggregateLayer);
