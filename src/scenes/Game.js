import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { Apple } from '../components/Apple';
import { PowerUp } from '../components/PowerUp';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.elapsedTime = 0;
    this.collectedApples = 0;
    this.powerUp;
    this.apples;
  }

  create() {
    this.timeText = this.add.text(100, 300, 'Tempo: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    this.collectedApplesText = this.add.text(100, 350, 'Frutas: 0 / 50', {
      fontSize: '32px',
      fill: '#000'
    })

    this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x4a18ed);

    // define as teclas de movimento
    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // cria cenário
    this.floor = this.add.image(0, 80, 'floor')
      .setOrigin(0, 0)
      .setDepth(1);

    // cria player
    this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 30);
    this.player.setScale(0.3);
    this.add.existing(this.player);
    this.player.setDepth(1);
    console.log(this.player);

    const treeScale = 1;

    this.tree1 = this.add.image(-40, -40, 'tree1')
      .setScale(treeScale)
      .setOrigin(0, 0)
      .setDepth(1);

    this.tree2 = this.add.image(this.game.config.width, -40, 'tree2')
      .setScale(treeScale)
      .setOrigin(0, 0)
      .setDepth(1);

    this.tree2.x = this.game.config.width - ((this.tree2.width * treeScale) - 40);

    // essas caixas são pro player não ultrapassar as árvores
    this.leftLimitBox = this.physics.add.staticImage(90, 0, null)
      .setSize(50, this.game.config.height)
      .setOffset(0, 50)
      .setDepth(1)
      .setVisible(false);

    this.rightLimitBox = this.physics.add.staticImage(this.game.config.width - 95, 0, null)
      .setSize(50, this.game.config.height)
      .setOffset(0, 50)
      .setDepth(1)
      .setVisible(false);

    this.physics.add.collider(this.player, this.leftLimitBox);
    this.physics.add.collider(this.player, this.rightLimitBox);

    // cria o grupo de maçãs
    this.apples = this.physics.add.group({
      classType: Apple,
      runChildUpdate: true
    });

    this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);


    // EVENTOS DE TEMPO
    // macã
    this.time.addEvent({
      delay: 700, // intervalo entre as maçãs
      callback: this.spawnApple,
      callbackScope: this,
      loop: true
    });

    // timer
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    })

    // powerup
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnPowerUp,
      callbackScope: this,
    })

    // FIM DO CREATE
  };

  updateTime() {
    this.elapsedTime += 1;

    this.timeText.setText('Tempo: ' + this.elapsedTime);
  }

  spawnApple() {
    const x = Phaser.Math.Between(130, this.scale.width - 120);
    const apple = new Apple(this, x, 0);
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setVelocityY(30);
    apple.body.setAngularVelocity(360); // a maçã vai girar enquanto cai
    apple.body.setVelocityY(500);
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
      this.collectedApplesText.setText('Frutas: ' + this.collectedApples + ' / 50');
      this.player.clearTint();
    });
    player.play('eat');

    this.time.delayedCall(200, () => {
      player.play('move'); // volta para a animação de boca fechada
    });
  };

  spawnPowerUp() {
    // if (!this.powerUp) {
      const x = Phaser.Math.Between(130, this.scale.width - 120);
      
      this.powerUp = new PowerUp(this, x, 0);
      
      this.add.existing(this.powerUp);
      
      this.powerUp.body.setVelocityY(30);
      this.powerUp.body.setAngularVelocity(360);
      this.powerUp.body.setVelocityY(500);
      
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
  

  collectPowerUp (player, powerUp) {
    if (powerUp.collected) {
      return
    }

    this.player.setTint(0xfff45e);

    powerUp.collected = true;

    powerUp.setActive(false);

    this.time.delayedCall(100, () => {
      powerUp.destroy();
      this.powerUp = null;
      this.player.clearTint();
    });
    player.play('eat');

    this.time.delayedCall(200, () => {
      player.play('move');
    })
  };

  update() {
    this.player.update(this.cursors, this.spaceBar);

    if (this.elapsedTime === 4) {
      console.log('FIM')
    }
  };
}