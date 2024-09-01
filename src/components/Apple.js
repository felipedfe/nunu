import Phaser from 'phaser';

export class Apple extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'apple');

    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true); 
    this.body.setGravityY(300);

    this.setScale(0.15)
  }

  update() {
    // console.log(this.scene)
    if (this.y > this.scene.scale.height) {
      this.destroy(); // destrói a maçã se ela sair da tela
    }
  }
}
