export default class Preload extends Phaser.Scene {
    constructor() {
      super("Preload");
    }
  
    init() {}
  
    preload() {

        //fondo y pj

        this.load.tilemapTiledJSON("lvl1", "assets/tilemaps/map1.json");
        this.load.image("tileset", "assets/images/Tileset.png");

        this.load.spritesheet("player", "assets/images/sprite-anarka.png", {
            frameWidth: 48,  // Ajustá esto al tamaño real de cada frame
            frameHeight: 64  // Ajustá esto también si hace falta
          });


    }

    
  create() {
    //animaciones caminar izquierda y derecha y quedarse quieto
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: "turn",
        frames: [{ key: "player", frame: 0 }],
        frameRate: 20
      });
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }
  
    update() {
        this.scene.start("Level1");
      }
    

}