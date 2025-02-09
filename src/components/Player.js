import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Sprite {
  life = 4;
  velocity = 600;
  initialAcceleration = 4000;
  acceleration = this.initialAcceleration;
  deceleration = 15000; // quanto menor mais ele demora pra parar
  // boostAcceleration = 8000;
  boostDeceleration = 7000;
  isBoosting = false;
  boostDirection = null; // para rastrear a direção do boost

  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.setOrigin(1, 1);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);

    // caixa de colisão
    this.body.setSize(65, 25);
    this.body.setOffset(22, 10);

    this.play('move');

    this.body.setDrag(this.deceleration); // adiciona atrito
    this.body.setMaxVelocity(this.velocity); // velocidade máxima para evitar que o jogador acelere infinitamente

    // rodinhas
    this.wheels = scene.add.sprite(this.x - (this.width * this.scaleX) / 2, this.y + 5, 'player', 'wheel');
    this.wheels.setVisible(false);
    // this.wheels.setScale(0.2)
    scene.physics.world.enable(this.wheels);
    this.wheels.body.setAllowGravity(false);

    // guarda a posicao inicial do personagem para poder subir ou descer quando a rodinha está ativada
    this.Y_POSITION = this.y
  }

  activateBoost(direction) {
    if (!this.isBoosting) {
      this.isBoosting = true;
      this.boostDirection = direction; // Salva a direção do boost
      this.body.setMaxVelocity(this.velocity * 1.5); // Aumenta a velocidade máxima
      // this.acceleration = this.boostAcceleration;
      this.deceleration = this.boostDeceleration;

      // ativa as rodinhas
      this.wheels.setVisible(true);
      this.wheels.body.setAngularVelocity(360);
      this.y = this.Y_POSITION - 30;

      // efeito de piscar enquanto o boost está ativo
      this.blinkEvent = this.scene.time.addEvent({
        delay: 300,
        callback: this.blink,
        callbackScope: this,
        loop: true,
      });
    }
  }

  deactivateBoost() {
    this.isBoosting = false;
    this.body.setMaxVelocity(this.velocity); // restaura a velocidade máxima
    this.acceleration = this.initialAcceleration; // restaura a aceleração normal

    // desativa as rodinhas
    this.wheels.body.setAngularVelocity(0);
    this.wheels.setVisible(false);
    this.y = this.Y_POSITION;

    // remove o evento de piscar
    if (this.blinkEvent) {
      this.blinkEvent.remove(false);
      this.clearTint();
    }
  }

  blink() {
    this.setTint(0xfff45e);

    if (this.scene) {
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      })
    }
  }

  // atualiza o player com base nas entradas do teclado
  update(cursors, key1, key2) {
    if (cursors.left.isDown || key1.isDown) {
      this.body.setAccelerationX(this.acceleration * -1); // move para a esquerda
      if (this.anims.currentAnim?.key !== 'eat' && (this.anims.currentAnim?.key !== 'move' || !this.anims.isPlaying)) {
        this.play('move');
      }

      // verifica se o jogador está mudando de direção enquanto o boost está ativo
      // if (this.isBoosting && this.boostDirection !== 'left') {
        // this.deactivateBoost(); // desativa o boost ao mudar de direção
        // this.y = this.Y_POSITION;
      // }
    } else if (cursors.right.isDown || key2.isDown) {
      this.body.setAccelerationX(this.acceleration); // move para a direita
      if (this.anims.currentAnim?.key !== 'eat' && (this.anims.currentAnim?.key !== 'move' || !this.anims.isPlaying)) {
        this.play('move');
      }

      // verifica se o jogador está mudando de direção enquanto o boost está ativo
      // if (this.isBoosting && this.boostDirection !== 'right') {
        // this.deactivateBoost(); // desativa o boost ao mudar de direção
        // this.y = this.Y_POSITION;
      // }
    } else {
      this.body.setAccelerationX(0);
    }

    // verifica se a tecla de espaço foi pressionada para ativar o boost
    // if (cursors.space.isDown) {
    //   if (cursors.left.isDown) {
    //     this.activateBoost('left');
    //   } else if (cursors.right.isDown) {
    //     this.activateBoost('right');
    //   }
    // }

    if (this.wheels.visible) {
      this.wheels.x = this.x - (this.width * this.scaleX) / 2;

      this.wheels.y = this.y + 5; // mantém as rodinhas na parte de baixo do personagem
    }
  }
}
