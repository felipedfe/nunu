import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { Apple } from '../components/Apple';
import { SpikyFruit } from '../components/SpikyFruit';
import { PowerUp } from '../components/PowerUp';
import { Hud } from '../components/Hud';
import { Stage1Builder } from '../builders/Stage1Builder';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.gameTime = 50;
    this.allDroppedApples = 0;
    this.collectedApples = 0;
    this.powerUp;
    this.apples;
    this.appleVelocity = 500;
    this.spikyFruits;
    this.spikyFruitPatternIndex = 0;
  }

  create() {
    this.physics.world.setBounds(120, 0, this.game.config.width - 200, this.game.config.height);

    // cria player
    this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 15);
    this.player.setScale(0.9);
    this.add.existing(this.player);
    this.player.setDepth(2);

    // cria o hud
    this.hud = new Hud(this);

    // cria cenário
    this.stage = new Stage1Builder(this);
    this.stage.createRain();
    this.stage.createFloor();
    this.stage.createTrees();

    // camera
    this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x000);

    // define as teclas de movimento
    this.cursors = this.input.keyboard.createCursorKeys();
    this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // cria o grupo de maçãs
    this.apples = this.physics.add.group({
      classType: Apple,
      runChildUpdate: true
    });

    this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);

    // cria grupo de spikyFruits
    this.spikyFruits = this.physics.add.group({
      classType: SpikyFruit,
      runChildUpdate: true
    })

    this.physics.add.overlap(this.player, this.spikyFruits, this.hit, null, this);

    // EVENTOS DE TEMPO
    // macã
    this.appleEvent = this.time.addEvent({
      delay: 1500, // intervalo entre as maçãs
      // callback: this.spawnSpikyFruits,
      callback: this.spawnApple,
      // callback: this.spawnZigZagApples,
      callbackScope: this,
      loop: true,
    });

    // pica-pau
    this.time.delayedCall(20000, () => {
      this.showWoodpecker();
    });

    // para a chuva
    this.time.delayedCall(45000, () => {
      this.stopRain();
    }, [], this);

    // vento
    // this.time.addEvent({
    //   delay: 3500,
    //   callback: this.wind,
    //   callbackScope: this,
    //   loop: true,
    // });

    // timer
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    })

    // powerup
    this.time.addEvent({
      delay: 33000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    })

    /////////////////////////// FIM DO CREATE //////////////////////////////
  };

  updateTime() {
    this.gameTime -= 1;
    this.timeText.setText(this.gameTime);

    if (this.gameTime <= 0) {
      // this.scene.stop('Game');
      this.scene.pause('Game');
      // this.endGame();
    }
  }

  endGame() {
    this.scene.start('GameOver', { score: this.collectedApples });
  }

  spawnApple() {
    this.allDroppedApples += 1;
    // this.totalFruitsText.setText('Frutas total: ' + this.allDroppedApples);
    const x = Phaser.Math.Between(130, this.scale.width - 120);
    const apple = new Apple(this, x, 0, 'apple');
    // apple.setScale(0.15);
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setAngularVelocity(360); // a maçã vai girar enquanto cai
    apple.body.setVelocityY(this.appleVelocity);

    // const rectangle = this.add.rectangle(x, 10, 50, 10, 0xfabfff).setDepth(99)
    // this.time.delayedCall(500, () => {
    //   rectangle.destroy();
    // })
  };

  spawnZigZagApples() {
    this.allDroppedApples += 1;
    // this.totalFruitsText.setText('Frutas total: ' + this.allDroppedApples);
    const x = Phaser.Math.Between(110, this.scale.width - 300);
    // const x = Phaser.Math.Between(this.scale.width - 300, this.scale.width - 300);
    const apple = new Apple(this, x, 0, 'apple');
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setAngularVelocity(360);
    apple.body.setVelocityY(500);

    // zigzag
    this.tweens.add({
      targets: apple,
      x: x + 180,               // mover tantos pixels para a direita
      yoyo: true,               // vai e volta
      repeat: -1,
      duration: 500,            // duração do movimento para um lado
      ease: 'Sine.easeInOut'
    });
  };

  collectApple(player, apple) {
    // verifica se a maçã já foi coletada
    if (apple.collected) {
      return;
    }
    this.player.setTint(0xfabfff);
    // marca a maca como coletada
    apple.collected = true;

    // desativa a física da maçã
    apple.setActive(false);

    this.time.delayedCall(100, () => {
      apple.destroy(); // destroi a maçã quando o jogador pega ela
      this.collectedApples += 1;
      this.collectedFruitsText.setText('Score: ' + this.collectedApples);
      this.player.clearTint();
    });
    player.play('eat');

    this.time.delayedCall(200, () => {
      player.play('move'); // volta para a animação de boca fechada
    });
  };

  spawnSpikyFruits() {
    // tela treme
    this.camera.shake(500, 0.015); // duração, intensidade

    // esses sao os padroes de "buracos" na sequencia de spikyFruits
    const SpikyFruitsPattern = {
      0: 1, // ex: buraco 2
      1: 3,
      2: 4,
      3: 6,
      4: 8,
      5: 5,
      6: 1,
      7: 2,
      8: 5,
      9: 8,
      10: 5,
    };

    let xPosition = 140;
    let space = 90;

    // usando o spikyFruitPatternIndex para pegar o buraco do padrão atual
    const holeIndex = SpikyFruitsPattern[this.spikyFruitPatternIndex];

    for (let i = 0; i < 8; i++) {
      // verifica se o índice atual é o buraco
      if (i === holeIndex) {
        // incrementa a posição x e pula a criação da fruta
        xPosition += space;
        continue;
      }

      const x = xPosition;
      const spikyFruit = new SpikyFruit(this, x, 0, 'spiky');
      spikyFruit.setScale(0.8);
      this.spikyFruits.add(spikyFruit);
      this.add.existing(spikyFruit);
      spikyFruit.body.setAngularVelocity(360);
      spikyFruit.body.setVelocityY(500);

      xPosition += space;
    }

    this.spikyFruitPatternIndex += 1;

    // se spikyFruitPatternIndex exceder o número de padrões, volta para o primeiro
    if (this.spikyFruitPatternIndex >= Object.keys(SpikyFruitsPattern).length) {
      this.spikyFruitPatternIndex = 0;
    }
  }

  spawnPowerUp() {
    // if (!this.powerUp) {
    const x = Phaser.Math.Between(130, this.scale.width - 120);

    this.powerUp = new PowerUp(this, x, 0);

    this.add.existing(this.powerUp);

    this.powerUp.body.setAngularVelocity(360);
    // this.powerUp.body.setVelocityY(500);
    this.powerUp.body.setVelocityY(250);

    this.powerUp.blinkTimer = this.time.addEvent({
      delay: 200,
      callback: this.powerUp.blink,
      callbackScope: this.powerUp,
      loop: true,
    });

    // overlap entre o player e o power-up
    this.physics.add.overlap(this.player, this.powerUp, this.collectPowerUp, null, this);
    // }
  }

  collectPowerUp(player, powerUp) {
    if (powerUp.collected) {
      if (powerUp.blinkTimer) {
        powerUp.blinkTimer.remove(false);
      }
      return
    }

    player.setTint(0xfff45e);
    powerUp.collected = true;
    powerUp.setActive(false);

    this.time.delayedCall(100, () => {
      powerUp.destroy();
      powerUp = null;
    });
    player.play('eat');
    player.activateBoost();

    this.time.delayedCall(200, () => {
      player.play('move');
    })

    this.time.delayedCall(12000, () => {
      player.deactivateBoost();
    })
  };

  hit(player, spikyFruit) {
    // verifica se a spikyFruit já causou dano
    if (!spikyFruit.hasDamagedPlayer) {
      this.player.life -= 1;
      // this.lifeText.setText('Life: ' + this.player.life);
      this.player.setTint(0xff0000);

      // marca que a spikyFruit já causou dano ao jogador
      spikyFruit.hasDamagedPlayer = true;

      this.time.delayedCall(100, () => {
        this.player.clearTint();
      });
    }
  }

  wind() {
    this.rain.setTexture('rain-wind');

    this.apples.children.iterate((apple) => {
      apple.body.setVelocityX(100);
    });

    this.time.delayedCall(2000, () => {
      this.rain.setTexture('rain');
    })
  }

  showWoodpecker() {
    // cria pica-pau
    this.bird = this.add.sprite(0, 300, 'pp-flying');
    this.bird.setScale(0.80);
    this.bird.play('fly');

    let repeatCount = 0;

    this.tweens.add({
      targets: this.bird,
      x: 750,              // posicao final no eixo X
      duration: 2000,
      ease: 'linear',
      onComplete: () => {
        this.appleEvent.paused = true;
        this.bird.setTexture('pp-peck', 'pp-peck-2')
        this.bird.stop();
        this.bird.x = 745;

        this.time.addEvent({
          delay: 1400,
          callback: () => {
            repeatCount += 1;
            this.camera.shake(500, 0.010); // duração, intensidade
            this.bird.play('peck');
            this.spawnZigZagApples();

            if (repeatCount > 6) {
              this.time.delayedCall(1000, () => {
                this.appleEvent.paused = false;
              });
              // this.appleEvent.paused = false;
              this.appleVelocity = 650;
              this.showThunder();
              this.startRain();
            }
          },
          callbackScope: this,
          repeat: 6,
        })
      },
      callbackScope: this
    });
  }

  startRain() {
    this.rainStarted = true;
    this.rain.alpha = 0.8;
  }

  stopRain() {
    this.tweens.add({
      targets: this.rain,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.rainStarted = false;
        this.rain.destroy();
      }
    });
  }

  showThunder() {
    this.flash = this.physics.add.sprite(0, 0, "flash-sprites").setDepth(3);
    this.flash.displayWidth = this.game.config.width;
    this.flash.setOrigin(0, 0);
    this.flash.alpha = 0.5;
    this.flash.play("flash");
    // callback lançada depois que animação termina
    this.flash.once("animationcomplete", () => {
      this.flash.alpha = 0;
    });
  }

  update() {
    this.player.update(
      this.cursors,
      this.A,
      this.D,
    );

    if (this.rainStarted) {
      this.rain.tilePositionY -= this.rainSpeedY;
      this.rain.tilePositionX -= this.rainSpeedX;
    }

    // console.log(Math.floor(this.game.loop.actualFps))
    // console.log(this.apples.getTotalUsed());

    if (this.powerUp && this.powerUp.y > this.game.config.height) {
      if (this.powerUp.blinkTimer) {
        this.powerUp.blinkTimer.remove(false);
      }
      this.powerUp.destroy();
      this.powerUp = null;
    }
  };
}