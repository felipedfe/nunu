import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { Apple } from '../components/Apple';
import { SpikyFruit } from '../components/SpikyFruit';
import { PowerUp } from '../components/PowerUp';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.elapsedTime = 0;
    this.allDroppedApples = 0;
    this.collectedApples = 0;
    this.powerUp;
    this.apples;
    this.spikyFruits;
    this.spikyFruitPatternIndex = 0;
  }

  create() {
    this.physics.world.setBounds(130, 0, this.game.config.width - 240, this.game.config.height);

    // cria player
    this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 30);
    this.player.setScale(0.9);
    this.add.existing(this.player);
    this.player.setDepth(2);

    // // cria pica-pau
    // this.bird = this.add.sprite(0, 300, 'pp-flying');
    // this.bird.play('fly');

    // this.tweens.add({
    //   targets: this.bird,
    //   x: 950,              // posicao final no eixo X
    //   duration: 2000,
    //   // ease: 'Sine.easeOut',
    //   ease: 'linear',
    //   onComplete: () => {
    //     // this.bird.play('peck');
    //     this.bird.setTexture('pp-peck', 'pp-peck-2')
    //     this.bird.stop();
    //     this.bird.x = 1012;
    //   },
    //   callbackScope: this
    // });

    // TEXTO
    this.timeText = this.add.text(100, 300, 'Tempo: 0', {
      fontSize: '32px',
      fill: '#000'
    }).setDepth(3);

    this.collectedApplesText = this.add.text(100, 350, 'Frutas coletadas: 0', {
      fontSize: '32px',
      fill: '#000'
    }).setDepth(3);

    this.allApplesText = this.add.text(100, 250, 'Frutas total: 0', {
      fontSize: '32px',
      fill: '#000'
    }).setDepth(3);

    this.lifeText = this.add.text(100, 200, 'Life: ' + this.player.life, {
      fontSize: '32px',
      fill: '#ff0000'
    }).setDepth(3);

    // CAMERA
    this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x4a18ed);
    // this.camera.setBackgroundColor(0x000);

    // define as teclas de movimento
    this.cursors = this.input.keyboard.createCursorKeys();

    // this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // CENÁRIO
    this.rainSpeedY = 3;
    // this.rainSpeedX = 1;

    // this.rain = this.add.tileSprite(0, -30, this.game.config.width, this.game.config.height, 'rain')
    //   .setOrigin(0, 0)
    //   .setDepth(2)
    //   // .setAlpha(0.5)

    this.floor = this.add.image(0, 80, 'stage-1', 'floor')
      .setOrigin(0, 0)
      .setDepth(1);

    const treeScale = 1;

    this.tree1 = this.add.image(-40, -40, 'stage-1', 'tree1')
      // .setScale(treeScale)
      .setOrigin(0, 0)
      .setDepth(1);

    this.tree2 = this.add.image(this.game.config.width, -40, 'stage-1', 'tree2')
      // .setScale(treeScale) 
      .setOrigin(0, 0)
      .setDepth(1);

    this.tree2.x = this.game.config.width - ((this.tree2.width * treeScale) - 40);

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
      // delay: 1500, // intervalo entre as maçãs
      delay: 1500, // intervalo entre as maçãs
      // callback: this.spawnSpikyFruits,
      callback: this.spawnApple,
      callbackScope: this,
      loop: true
    });

    // frutas espinhosas
    this.time.delayedCall(10000, () => { // tempo em milissegundos
      this.appleEvent.remove(); // para o evento das maçãs

      // cria o evento das frutas espinhosas
      this.spikyFruitEvent = this.time.addEvent({
        delay: 3000,
        callback: this.spawnSpikyFruits,
        callbackScope: this,
        loop: true
      });
    }, null, this);

    // pica-pau
    this.time.delayedCall(10000, () => {
      this.showWoodpecker();
    });

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
      delay: 20000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    })

    /////////////////////////// FIM DO CREATE //////////////////////////////
  };

  updateTime() {
    this.elapsedTime += 1;

    this.timeText.setText('Tempo: ' + this.elapsedTime);
  }

  spawnApple() {
    this.allDroppedApples += 1;
    this.allApplesText.setText('Frutas total: ' + this.allDroppedApples);
    const x = Phaser.Math.Between(130, this.scale.width - 120);
    const apple = new Apple(this, x, 0, 'apple');
    // apple.setScale(0.15);
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setAngularVelocity(360); // a maçã vai girar enquanto cai
    apple.body.setVelocityY(500);

    // zigzag
    // this.tweens.add({
    //   targets: apple,
    //   x: x + 130,                // Mover tantos pixels para a direita
    //   yoyo: true,               // Vai e volta (zigue-zague)
    //   repeat: -1,               // Repetição infinita
    //   duration: 500,            // Duração do movimento para um lado (500ms)
    //   ease: 'Sine.easeInOut'    // Suaviza o movimento para parecer natural
    // });

    // const rectangle = this.add.rectangle(x, 10, 50, 10, 0xfabfff).setDepth(99)
    // this.time.delayedCall(500, () => {
    //   rectangle.destroy();
    // })
  };

  spawnZigZagApples() {
    this.allDroppedApples += 1;
    this.allApplesText.setText('Frutas total: ' + this.allDroppedApples);
    const x = Phaser.Math.Between(130, this.scale.width - 120);
    const apple = new Apple(this, x, 0, 'apple');
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setAngularVelocity(360);
    apple.body.setVelocityY(500);

    // zigzag
    this.tweens.add({
      targets: apple,
      x: x + 130,               // Mover tantos pixels para a direita
      yoyo: true,               // Vai e volta (zigue-zague)
      repeat: -1,               // Repetição infinita
      duration: 500,            // Duração do movimento para um lado (500ms)
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
      // apple.disableBody(true, false);
      apple.destroy(); // destroi a maçã quando o jogador pega ela
      this.collectedApples += 1;
      this.collectedApplesText.setText('Frutas coletadas: ' + this.collectedApples);
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

    let xPosition = 180;
    let space = 100;

    // usando o spikyFruitPatternIndex para pegar o buraco do padrão atual
    const holeIndex = SpikyFruitsPattern[this.spikyFruitPatternIndex];

    for (let i = 0; i < 9; i++) {
      // verifica se o índice atual é o buraco
      if (i === holeIndex) {
        // incrementa a posição x e pula a criação da fruta
        xPosition += space;
        continue;
      }

      const x = xPosition;
      const spikyFruit = new SpikyFruit(this, x, 0, 'spiky');
      // spikyFruit.setScale(0.15);
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

    this.time.addEvent({
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
      return
    }

    player.setTint(0xfff45e);

    powerUp.collected = true;

    powerUp.setActive(false);

    this.time.delayedCall(100, () => {
      powerUp.destroy();
      powerUp = null;
      // player.clearTint();
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
      this.lifeText.setText('Life: ' + this.player.life);
      this.player.setTint(0xff0000);

      // Marca que a spikyFruit já causou dano ao jogador
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
    this.bird.play('fly');

    this.tweens.add({
      targets: this.bird,
      x: 950,              // posicao final no eixo X
      duration: 2000,
      // ease: 'Sine.easeOut',
      ease: 'linear',
      onComplete: () => {
        // this.bird.play('peck');
        this.bird.setTexture('pp-peck', 'pp-peck-2')
        this.bird.stop();
        this.bird.x = 1012;
      },
      callbackScope: this
    });
  }

  ///////////////////////////// UPDATE ////////////////////////////////

  update() {
    this.player.update(
      this.cursors,
      // this.spaceBar
    );

    // this.rain.tilePositionY -= this.rainSpeedY;

    // this.rain.tilePositionX -= this.rainSpeedX;

    // console.log(Math.floor(this.game.loop.actualFps))

    // console.log(this.apples.getTotalUsed());
  };
}