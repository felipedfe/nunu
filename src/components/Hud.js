export class Hud {
  constructor(scene) {
    this.scene = scene;
    scene.hudContainer = scene.add.container(0, 0).setDepth(3);
    const containerHeight = 55;

    const hudBackground = scene.add.graphics();
    hudBackground.fillStyle(0xffffff, 1);
    hudBackground.fillRect(0, 0, scene.game.config.width, containerHeight);
    hudBackground.strokeRect(0, 0, scene.game.config.width, containerHeight);

    const hudLine = scene.add.graphics();
    hudLine.lineStyle(2.5, 0x000000, 1);
    hudLine.lineBetween(0, containerHeight, scene.game.config.width, containerHeight);

    scene.timeText = scene.add.text(scene.game.config.width / 2, 15, scene.gameTime, { fontSize: "26px", fill: "#000", fontFamily: "monospace" });
    // scene.lifeText = scene.add.text(20, 20, `Life: ${scene.player.life}`, { fontSize: "18px", fill: "#ff0000", fontFamily: "monospace" });
    // scene.totalFruitsText = scene.add.text(200, 25, `Frutas total: ${scene.allDroppedApples}`, { fontSize: "18px", fill: "#000", fontFamily: "monospace" });
    scene.collectedFruitsText = scene.add.text(600, 25, `Score: ${scene.collectedApples}`, { fontSize: "18px", fill: "#000", fontFamily: "monospace" });

    scene.hudContainer.add([hudBackground, scene.timeText, scene.collectedFruitsText, hudLine]);
  }

  update(time, score) {
    scene.timeText.setText(time);
    scene.collectedFruitsText.setText(`Score: ${score}`);
  }
}
