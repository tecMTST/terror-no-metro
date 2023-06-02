class ScoreTracker {
  static Behaviors = {
    Display: "display",
  };

  static create(manager: GameManager) {
    const score = new Entity("score-tracker", 0);
    score.position.x = -width / 2;
    score.position.y = -height / 2;

    ScoreTracker.display(manager, score);

    manager.addEntity(score, score.layer);
  }

  static display(manager: GameManager, score: Entity) {
    let copList: Entity[] = [];

    const resetGame = () => {
      Player.MarmitaSettings.timer = Player.MarmitaSettings.maxTime;
      Player.MarmitaSettings.deliverCount = 0;
      for (const cop of copList) {
        manager.removeEntity(cop);
      }
      copList = [];
      Cops.currentSpeed = 0;
      manager.getEntity(`cop0`).position.y = height / 2 - manager.UnitSize;
      manager.getEntity(`cop0`).position.x = -width / 2 + manager.UnitSize / 2;
      manager.getEntity("player").position.x = 0;
      manager.getEntity("player").position.y = height * 0.4;
    };

    const copImage = manager.getAsset(AssetList.Marmita.name) as p5.Image;

    score.addBehavior(
      ScoreTracker.Behaviors.Display,
      (e) => {
        textAlign(LEFT, TOP);
        fill(255);
        textSize(manager.UnitSize / 2);
        text(Player.MarmitaSettings.timer--, 0, 0);
        noStroke();
        rect(
          0,
          0,
          ((width - manager.UnitSize * 1.5) * Player.MarmitaSettings.timer) /
            Player.MarmitaSettings.maxTime,
          manager.UnitSize / 2
        );
        textAlign(RIGHT);
        text(Player.MarmitaSettings.deliverCount, width, 0);
        image(
          copImage,
          width - manager.UnitSize * 0.75,
          manager.UnitSize / 4,
          manager.UnitSize / 2,
          manager.UnitSize / 2
        );

        if (Player.MarmitaSettings.timer < 2) {
          if (Player.MarmitaSettings.timer === 1) {
            manager.playAudio(AssetList.SireneDerrotaSFX.name);
            for (let i = 1; i < 10; i++) {
              copList.push(Cops.create(manager, Helpers.randSign()));
            }
          }
          const hasEvent = manager.getEvent(
            Cops.Events.CollisionWithPlayer.name
          );
          Player.MarmitaSettings.timer = 0;
          if (hasEvent !== undefined) {
            defeatScreen(manager);
            manager.state = GameStates.DEFEAT_SCREEN;
            resetGame();
          }
        }
        if (Player.MarmitaSettings.deliverCount >= 10) {
          victoryScreen(manager);
          manager.state = GameStates.VICTORY_SCREEN;
          resetGame();
        }
      },
      true
    );
  }
}
