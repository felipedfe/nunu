// import Phaser from 'phaser';

// export class Player extends Phaser.GameObjects.Sprite {
//   life = 10;
//   velocity = 600;
//   acceleration = 4000;
//   deceleration = 3000; // quanto menor mais ele demora pra parar
//   boostAcceleration = 8000;
//   isBoosting = false;

//   constructor(scene, x, y) {
//     super(scene, x, y, 'player');

//     this.setOrigin(0.5, 0.5);
//     scene.physics.world.enable(this);
//     this.body.setCollideWorldBounds(true);

//     this.body.setDrag(this.deceleration); // adiciona atrito
//     this.body.setMaxVelocity(this.velocity); // velocidade máxima para evitar que o jogador acelere infinitamente
//   }

//   activateBoost() {
//     if (!this.isBoosting) {
//       this.isBoosting = true;
//       this.body.setMaxVelocity(this.velocity * 4); // Aumenta a velocidade máxima
//       // this.acceleration = this.boostAcceleration; // Aumenta a aceleração temporariamente

//       // Desativa o boost após 1 ou 2 segundos
//       this.scene.time.delayedCall(1000, () => {
//         this.isBoosting = false;
//         this.body.setMaxVelocity(this.velocity); // Restaura a velocidade máxima
//         this.acceleration = 4000; // Restaura a aceleração normal
//       });
//     }
//   }

//   // atualiza o player com base nas entradas do teclado
//   update(cursors) {
//     if (cursors.left.isDown) {
//       this.body.setAccelerationX(this.acceleration * -1); // move para a esquerda
//     } else if (cursors.right.isDown) {
//       this.body.setAccelerationX(this.acceleration); // move para a direita
//     } else {
//       this.body.setAccelerationX(0);
//     }

//     // verifica se a tecla de espaço foi pressionada para ativar o boost
//     if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
//       this.activateBoost();
//     }
//   }
// }


import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Sprite {
  life = 10;
  velocity = 600;
  initialAcceleration = 4000;
  acceleration = this.initialAcceleration;
  deceleration = 3000; // quanto menor mais ele demora pra parar
  // boostAcceleration = 8000;
  boostDeceleration = 7000;
  isBoosting = false;
  boostDirection = null; // para rastrear a direção do boost

  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.setOrigin(0.5, 0.5);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);

    this.body.setDrag(this.deceleration); // adiciona atrito
    this.body.setMaxVelocity(this.velocity); // velocidade máxima para evitar que o jogador acelere infinitamente
  }

  activateBoost(direction) {
    if (!this.isBoosting) {
      this.isBoosting = true;
      this.boostDirection = direction; // Salva a direção do boost
      this.body.setMaxVelocity(this.velocity * 2); // Aumenta a velocidade máxima
      // this.acceleration = this.boostAcceleration;
      this.deceleration = this.boostDeceleration;

      // desativa o boost após 1 segundo
      this.scene.time.delayedCall(1000, () => {
        this.deactivateBoost();
      });
    }
  }

  deactivateBoost() {
    this.isBoosting = false;
    this.body.setMaxVelocity(this.velocity); // restaura a velocidade máxima
    this.acceleration = this.initialAcceleration; // restaura a aceleração normal
  }

  // atualiza o player com base nas entradas do teclado
  update(cursors) {
    if (cursors.left.isDown) {
      this.body.setAccelerationX(this.acceleration * -1); // Move para a esquerda

      // verifica se o jogador está mudando de direção enquanto o boost está ativo
      if (this.isBoosting && this.boostDirection !== 'left') {
        this.deactivateBoost(); // desativa o boost ao mudar de direção
      }
    } else if (cursors.right.isDown) {
      this.body.setAccelerationX(this.acceleration); // move para a direita

      // verifica se o jogador está mudando de direção enquanto o boost está ativo
      if (this.isBoosting && this.boostDirection !== 'right') {
        this.deactivateBoost(); // desativa o boost ao mudar de direção
      }
    } else {
      this.body.setAccelerationX(0);
    }

    // verifica se a tecla de espaço foi pressionada para ativar o boost
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (cursors.left.isDown) {
        this.activateBoost('left');
      } else if (cursors.right.isDown) {
        this.activateBoost('right');
      }
    }
  }
}
