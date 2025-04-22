export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  init() {}

  create() {
    const map1 = this.make.tilemap({ key: "lvl1" });
    const tileset = map1.addTilesetImage("tileset-anarka", "tileset");

    const backgroundLayer = map1.createLayer("background", tileset, 0, 0);
    const floorLayer = map1.createLayer("floor", tileset, 0, 0);

    const spawnPoint = map1.findObject(
      "objects",
      (obj) => obj.name === "player"
    );

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
    // Colisiones
    floorLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, floorLayer);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("right", true); // Usás "right" pero lo flipás
      this.player.setFlipX(true); // ↢ Voltea horizontalmente
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true); // Misma animación
      this.player.setFlipX(false); // ↣ Normal
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
  }
}
