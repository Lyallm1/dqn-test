import { sampleSize } from 'lodash';

export interface Frame {
  state: number[];
  action: number;
  nextState: number[];
  reward?: number;
  done?: boolean;
}

export class DequeBuffer {
  private _frames: Frame[] = [];
  get frames() { return this._frames; }
  set frames(v) { this._frames = v; }

  constructor(private maxSize: number) {}

  append(frame: Frame) {
    if (this.frames.length > this.maxSize) this.frames.shift();
    this.frames.push(frame);
  }

  sample(batchSize: number) {
    return sampleSize(this.frames, batchSize);
  }

  canTrain(batchSize: number) {
    return this.frames.length > batchSize;
  }
}
