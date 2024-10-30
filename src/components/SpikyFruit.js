import { Apple } from './Apple';

export class SpikyFruit extends Apple {
  constructor(scene, x, y) {
    super(scene, x, y, 'stage-1-v2', 'apple');
    // this.setTint(0xff0000)
  }
}