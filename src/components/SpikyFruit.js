import { Apple } from './Apple';

export class SpikyFruit extends Apple {
  constructor(scene, x, y) {
    super(scene, x, y, 'apple');
    this.setTint(0xff0000)
  }
}