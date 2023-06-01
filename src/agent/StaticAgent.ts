import * as tf from '@tensorflow/tfjs-node';

import { Action } from '../game/Action.js';
import { DequeBuffer } from '../experimental/DequeBuffer.js';
import { Reward } from '../game/Reward.js';
import { StaticModel } from './StaticModel.js';
import fs from 'fs-extra';

export class StaticAgent {
  private trainModel: tf.LayersModel;
  private predictModel: tf.LayersModel;
  buffer = new DequeBuffer(300000);
  training = false;
  epsilon = 0.9;
  epsilonDecay = 0.99998875;
  score = 0;
  updateEvery = 100;
  toUpdate = 0;
  step = 0;
  verify = tf.tensor2d(fs.readJSONSync('./src/testing/test.data.json'));

  async init(loadPretrained = false) {
    this.predictModel = this.trainModel = loadPretrained ? await tf.loadLayersModel('file://static-pretrained/model.json') : StaticModel.create()
    if (loadPretrained) {
      this.predictModel.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
      this.trainModel.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
      this.predictModel.summary();
      this.trainModel.summary();
      console.log('loaded');
    }
  }

  async train() {
    if (this.buffer.canTrain(250000)) {
      const batch = this.buffer.sample(100), x: number[][] = [], y: any[] = [];
      batch.forEach((frame, index) => {
        const currentQ = tf.tidy((this.trainModel.predict(tf.tensor2d(Array.from(batch, element => element.state))) as tf.Tensor).arraySync)[index];
        currentQ[frame.action - 1] = frame.reward === Reward.OBSTACLE ? frame.reward : frame.reward + 0.8 * Math.max(
          ...tf.tidy((this.trainModel.predict(tf.tensor2d(Array.from(batch, element => element.nextState))) as tf.Tensor).arraySync)[index]
        );
        x.push(frame.state);
        y.push(currentQ);
      });
      await this.trainModel.fit(tf.tensor2d(x), tf.tensor2d(y));
      await this.saveModel();
      this.updateModel();
      this.epsilon *= this.epsilonDecay;
      this.testPredict();
    }
  }

  async saveModel() {
    if (this.step % 1000 === 0) {
      await this.trainModel.save('file://pretrained/static/step' + this.step);
      console.log('SAVING MODEL, EPSILON: ' + this.epsilon + ' STEP: ' + this.step);
    }
  }

  async predict(state: any) {
    this.step++;
    await this.train();
    return Math.random() < this.epsilon ? Action.random() : tf.tidy(() => {
      const qs = (this.predictModel.predict(tf.tensor2d([state])) as tf.Tensor).dataSync();
      return parseInt(Object.keys(qs).reduce((a, b) => qs[a] > qs[b] ? a : b)) + 1;
    });
  }

  updateModel() {
    this.toUpdate++;
    if (this.toUpdate > this.updateEvery) {
      this.predictModel.setWeights(this.trainModel.getWeights());
      console.log('UPDATING MODEL, EPSILON: ' + this.epsilon + ' STEP: ' + this.step);
      this.toUpdate = 0;
    }
  }

  testPredict() {
    tf.tidy((this.trainModel.predict(this.verify) as tf.Tensor).print);
    console.log('EPSILON: ' + this.epsilon);
    console.log('3, 1, 4');
  }
}
