export class Stage1Builder {
  constructor(scene) {
    this.scene = scene;
    this.createFloor();
    this.createTrees();
    this.createRain();
  }

  createFloor() {
    this.scene.floor = this.scene.add.image(0, this.scene.game.config.height - 30, 'stage-1', 'floor')
      .setOrigin(0, 0)
      .setDepth(1);
  }

  createTrees() {
    this.scene.tree1 = this.scene.add.image(0, 0, 'stage-1', 'tree1')
      .setOrigin(0, 0)
      .setDepth(1);

    this.scene.tree2 = this.scene.add.image(this.scene.game.config.width, 0, 'stage-1', 'tree2')
      .setOrigin(1, 0) // Ajusta para alinhar a segunda árvore na borda direita
      .setDepth(1);
  }

  createRain() {
    this.scene.rainSpeedY = 6;
    this.scene.rainSpeedX = 0.5;

    this.scene.rain = this.scene.add.tileSprite(0, -30, this.scene.game.config.width, this.scene.game.config.height, 'rain')
      .setOrigin(0, 0)
      .setDepth(2)
      .setAlpha(0);

    this.scene.rainStarted = false;
  }

  startRain() {
    this.scene.rainStarted = true;
    this.scene.rain.alpha = 0.8;
  }

  stopRain() {
    this.scene.tweens.add({
      targets: this.scene.rain,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.scene.rainStarted = false;
        this.scene.rain.destroy();
      }
    });
  }
}
