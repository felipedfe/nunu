import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
        console.log(this.score)
    }

    create() {
        this.scene.stop('Game');
        // this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(0, 0, 'Game Over', { fontSize: "26px", fill: "#000", fontFamily: "monospace" }).setOrigin(0.5);

        this.add.text(512, 400, `Score: ${this.score}`, { fontSize: "26px", fill: "#000", fontFamily: "monospace" }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
