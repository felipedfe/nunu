import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        })
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        // this.load.image('apple', 'fruit.png');
        // this.load.image('wheel', 'wheel.png');
        // this.load.image('tree1', 'tree1-v5.png');
        // this.load.image('tree2', 'tree2-v5.png');
        // this.load.image('floor', 'floor.png');
        // this.load.image('powerUp', 'power-up.png');
        this.load.image('rain', 'rain.png');
        this.load.image('rain-wind', 'rain-wind.png');

        // this.load.atlas('character', 'character.png', 'character.json');
        this.load.atlas('player', 'player-b.png', 'player-b.json');
        this.load.atlas('pp-flying', 'pp-flying.png', 'pp-flying.json');
        this.load.atlas('pp-peck', 'pp-peck.png', 'pp-peck.json');
        this.load.atlas('stage-1', 'stage-1-b.png', 'stage-1-b.json');

        this.load.spritesheet('flash-sprites', 'flash-sprites.jpg', { frameWidth: 480, frameHeight: 640 });
        this.load.spritesheet('flash-sprites-2', 'flash-sprites-2.png', { frameWidth: 480, frameHeight: 640 });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        // animações do personagem
        this.anims.create({
            key: 'move',
            frames: [
                { key: 'player', frame: 'boca-fechada-1-low' },
                { key: 'player', frame: 'boca-fechada-2-low' }
            ],
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'eat',
            frames: [{ key: 'player', frame: 'boca-aberta-low' }],
            frameRate: 1
        });

        this.anims.create({
            key: 'fly',
            frames: [
                { key: 'pp-flying', frame: 'pp-flying-1' },
                { key: 'pp-flying', frame: 'pp-flying-2' }
            ],
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'peck',
            frames: [
                { key: 'pp-peck', frame: 'pp-peck-1' },
                { key: 'pp-peck', frame: 'pp-peck-2' }
            ],
            frameRate: 10,
            repeat: 2,
        })

        this.anims.create({
            key: 'flash',
            frames: this.anims.generateFrameNumbers('flash-sprites', { start: 0, end: 2 }),
            frameRate: 30,
            repeat: 10,
          });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
