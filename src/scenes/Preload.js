export default class Preload extends Phaser.Scene {
    constructor() {
      super("Preload");
    }
  
    init() {}
  
    preload() {

        //fondo y pj

        this.load.image(
          "tileset",
          "assets/images/sprite-anarka.png"
        );

        this.load.image(
            "anarka",
            "assets/sprite-anarka.png"
          );

    }

    update() {
        this.scene.start("Nivel1");
      }
    

}