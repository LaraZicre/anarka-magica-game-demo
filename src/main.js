import Preload from "./scenes/Preload.js";
//import Intro from "./scenes/Intro.js";
import Fight from "./scenes/Fight.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000000",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 }, // Ajustá según lo que necesites
            debug: false // Cambialo a true si querés ver las colisiones
        }
    },

    scene: [Preload, Fight],
};

const game = new Phaser.Game(config);
