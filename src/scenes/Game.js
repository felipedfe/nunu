// import { Scene } from 'phaser';
// import { Player } from '../components/Player';
// import { Apple } from '../components/Apple';

// export class Game extends Scene {
//   constructor() {
//     super('Game');
//   }

//   create() {
//     this.camera = this.cameras.main;
//     this.camera.setBackgroundColor(0xffffff);

//     // define as teclas de movimento
//     this.cursors = this.input.keyboard.createCursorKeys();

//     this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//     // cria player
//     this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 40);
//     this.player.setScale(0.3);
//     this.add.existing(this.player);
//     this.player.setDepth(1);
//     console.log(this.player);

//     // cria cenário
//     const treeScale = 1;

//     this.tree1 = this.add.image(-40, -40, 'tree1')
//       .setScale(treeScale)
//       .setOrigin(0, 0)
//       .setDepth(1);

//     this.tree2 = this.add.image(this.game.config.width, -40, 'tree2')
//       .setScale(treeScale)
//       .setOrigin(0, 0)
//       .setDepth(1);

//     this.tree2.x = this.game.config.width - ((this.tree2.width * treeScale) - 40)
//     console.log(this.tree2)

//     // calcula os limites do cenário baseado nas árvores
//     this.leftLimit = this.tree1.x + (this.tree1.width * treeScale);
//     this.rightLimit = this.tree2.x;

//     // cria o grupo de maçãs
//     this.apples = this.physics.add.group({
//       classType: Apple,
//       runChildUpdate: true
//     });

//     this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);

//     this.time.addEvent({
//       delay: 1000, // intervalo entre as maçãs
//       callback: this.spawnApple,
//       callbackScope: this,
//       loop: true
//     });

//     // FIM DO CREATE
//   }

//   // spawnApple() {
//   //   const x = Phaser.Math.Between(0, this.scale.width);
//   //   const apple = this.apples.get(x, 0); // pega uma maçã do grupo

//   //   if (apple) {
//   //     apple.setActive(true);
//   //     apple.setVisible(true);
//   //     apple.body.setVelocity(0, 200); // velocidade de queda
//   //   }
//   // }

//   spawnApple() {
//     const x = Phaser.Math.Between(0, this.scale.width);
//     const apple = new Apple(this, x, 0);
//     this.apples.add(apple);
//     this.add.existing(apple);
//     apple.body.setVelocityY(30);
//     apple.body.setAngularVelocity(360); // a maçã vai girar enquanto cai
//     apple.body.setVelocityY(300);
//   }

//   collectApple(player, apple) {
//     this.physics.world.removeCollider(apple.colliderWithPlayer);

//     this.time.delayedCall(100, () => {
//       apple.destroy(); // destroi a maçã quando o jogador pega ela
//     })
//     player.play('eat');

//     this.time.delayedCall(200, () => {
//       player.play('move'); // volta para a animação de boca fechada
//     });
//   }

//   update() {
//     this.player.update(this.cursors, this.spaceBar);

//     // impede o jogador de ultrapassar os limites das árvores
//     if (this.player.x < this.leftLimit) {
//       this.player.x = this.leftLimit;
//     } else if (this.player.x > this.rightLimit) {
//       this.player.x = this.rightLimit;
//     }
//   }
// }

import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { Apple } from '../components/Apple';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xffffff);

    // define as teclas de movimento
    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // cria player
    this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 40);
    this.player.setScale(0.3);
    this.add.existing(this.player);
    this.player.setDepth(1);
    console.log(this.player);

    // cria cenário
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
    console.log(this.tree2);


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

    this.time.addEvent({
      delay: 1000, // intervalo entre as maçãs
      callback: this.spawnApple,
      callbackScope: this,
      loop: true
    });

    // FIM DO CREATE
  }

  spawnApple() {
    const x = Phaser.Math.Between(0, this.scale.width);
    const apple = new Apple(this, x, 0);
    this.apples.add(apple);
    this.add.existing(apple);
    apple.body.setVelocityY(30);
    apple.body.setAngularVelocity(360); // a maçã vai girar enquanto cai
    apple.body.setVelocityY(300);
  }

  collectApple(player, apple) {
    this.physics.world.removeCollider(apple.colliderWithPlayer);

    this.time.delayedCall(100, () => {
      apple.destroy(); // destroi a maçã quando o jogador pega ela
    });
    player.play('eat');

    this.time.delayedCall(200, () => {
      player.play('move'); // volta para a animação de boca fechada
    });
  }

  update() {
    this.player.update(this.cursors, this.spaceBar);
  }
}
