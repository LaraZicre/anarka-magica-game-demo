import { Preload } from "./scenes/Preload.js";
import { Game } from "./scenes/Game.js";


const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
    resolution: 2, // Incrementa la resolución (2 = el doble, 3 = triple, etc.)
    pixelArt: true, // Habilita el renderizado en modo pixel art
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el tamaño del juego manteniendo la proporción
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }, // Centra el juego en la ventana

    scene: [Preload, Game,],
};

const game = new Phaser.Game(config);
