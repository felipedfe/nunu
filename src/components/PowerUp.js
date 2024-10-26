import Phaser from 'phaser';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'stage-1', 'power-up');

    this.collected = false;

    // adiciona o objeto ao mundo físico e à cena
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // configura o corpo físico arcade
    // this.setCollideWorldBounds(true); 
    this.setGravityY(120);

    // this.setScale(0.15);

    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: this.blink,
    //   callbackScope: this,
    //   loop: true,
    // })
  }

  blink() {
    this.setTint(0xfff45e);

    if (this.scene) {
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      })
    }
  }

  update() {
    // se o powerup sair da tela, ela será destruída
    if (this.y > this.scene.scale.height) {
      this.destroy();
    }
  }
}
