import Phaser from 'phaser';

export class Apple extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'apple');

    this.collected = false;

    // adiciona o objeto ao mundo físico e à cena
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // configura o corpo físico arcade
    // this.setCollideWorldBounds(true); 
    this.setGravityY(300);

    this.setScale(0.15);
  }

  update() {
    // se a maçã sair da tela, ela será destruída
    if (this.y > this.scene.scale.height) {
      this.destroy();
    }
  }
}
