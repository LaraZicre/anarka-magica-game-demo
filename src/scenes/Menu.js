export default class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {
        // Agregar el fondo del menú
        this.add.image(400, 300, "menubg").setOrigin(0.5);

        // Crear el botón de play
        const playButton = this.add.text(400, 300, "Jugar", {
            fontSize: "48px",
            fill: "#E6E6FA", // Lila claro
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Hacer el botón interactivo
        playButton.setInteractive();

        // Efectos de hover
        playButton.on("pointerover", () => {
            playButton.setStyle({ fill: "#9370DB" }); // Lila más intenso al pasar el mouse
        });

        playButton.on("pointerout", () => {
            playButton.setStyle({ fill: "#E6E6FA" }); // Volver al lila claro
        });

        // Acción al hacer click
        playButton.on("pointerdown", () => {
            // Efecto de fade out antes de cambiar de escena
            this.cameras.main.fadeOut(1000);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("Cinematic");
            });
        });
    }
}