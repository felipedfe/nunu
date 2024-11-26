import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  // width: 1024,
  width: 1150,
  // height: 768,
  height: 867,   // nova proporcao (850 x 640 px)
  parent: 'game-container',
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // fps: {
  //   target: 30,
  //   forceSetTimeOut: true
  // },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      // debugBodyColor: 0xb0f2ff,
      gravity: { y: 0 },
    }
  },
  scene: [
    Boot,
    Preloader,
    // MainMenu,
    Game,
    GameOver
  ]
};

export default new Phaser.Game(config);
