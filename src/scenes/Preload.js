export default class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  init() {}

  preload() {
    //fondo y pj
    this.load.tilemapTiledJSON("lvl1", "assets/tilemaps/map1.json");
    this.load.image("tileset", "assets/images/Tileset.png");

    this.load.spritesheet("player", "assets/images/b.png", {
      frameWidth: 96, // Ajustá esto al tamaño real de cada frame
      frameHeight: 128, // Ajustá esto también si hace falta
    });

    this.load.spritesheet("enemy", "assets/images/sprite-enemigo1B.png", {
        frameWidth: 192,
        frameHeight: 160,
      });

    this.load.image("pelea", "assets/images/borrador pelea1.png");
    this.load.image("bg1", "assets/images/1.png");
    this.load.image("bg2", "assets/images/2.png");
    this.load.image("bg3", "assets/images/3.png");
    this.load.image("bg4", "assets/images/4.png");
    this.load.image("bg5", "assets/images/5.png");
  }

  create() {
    //animaciones caminar izquierda y derecha y quedarse quieto
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
        key: "enemyReact",
        frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 1 }), // Ajustá los frames a tu spritesheet
        frameRate: 6,
        repeat: 0 // solo una vez
      });
      
  }

  update() {
    this.scene.start("Cinematic");
  }
}
