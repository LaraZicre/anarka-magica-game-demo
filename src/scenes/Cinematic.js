export default class Cinematic extends Phaser.Scene {
    constructor() {
        super("Cinematic");
    }

    preload() {
        // Las imágenes ya están cargadas en Preload.js
    }

    create() {
        this.textIndex = 0;
        this.canProgress = true; // Nueva bandera para controlar el progreso

        // Configuración del fondo negro
        this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0);

        // Crear las imágenes de fondo y ocultarlas inicialmente
        this.backgrounds = [
            this.add.image(400, 300, 'bg1'),
            this.add.image(400, 300, 'bg2'),
            this.add.image(400, 300, 'bg3'),
            this.add.image(400, 300, 'bg4'),
            this.add.image(400, 300, 'bg5')
        ];

        // Centrar y ajustar tamaño de las imágenes
        this.backgrounds.forEach(bg => {
            bg.setOrigin(0.5);
            // Ajustar la escala para que quepa en la pantalla manteniendo proporción
            const scaleX = 800 / bg.width;
            const scaleY = 600 / bg.height;
            const scale = Math.min(scaleX, scaleY);
            bg.setScale(scale);
            bg.setAlpha(0); // Inicialmente transparentes
        });

        this.texts = [
            "Era una noche como cualquier otra en el barrio...\nUna joven camina por las calles para aliviar su insomnio.",
            "Ella no llamaba mucho la atención. Una chica callada, invisible, que se escabullía entre la gente para no molestar.\nPero esa noche algo cambió.",
            "Entre el humo y los gritos, en una grieta del asfalto, brillaba algo...\nUna pequeña estrella de plata, sucia pero viva, como si la hubiera estado esperando.",
            "Sin pensarlo, se la guardó en el bolsillo.\nUn impulso. Un reflejo. Un error… o tal vez un destino.",
            "Desde entonces, nada volvió a ser normal."
        ];

        // Texto principal (máquina de escribir)
        this.fullText = "";
        this.displayedText = "";
        this.textObject = this.add.text(50, 450, "", {
            fontSize: "24px",
            fill: "#ffffff",
            wordWrap: { width: 700 }
        });

        // Agregar un fondo semi-transparente para el texto
        this.textBackground = this.add.rectangle(0, 425, 800, 175, 0x000000, 0.7);
        this.textBackground.setOrigin(0);

        this.timeBetweenLetters = 40;
        this.typing = false;
        this.typeTextEvent = null;

        this.input.keyboard.on("keydown-SPACE", () => {
            if (!this.canProgress) return; // Si no podemos progresar, ignorar la tecla

            if (this.typing) {
                // Mostrar texto completo si aún está escribiendo
                this.typing = false;
                this.displayedText = this.fullText;
                this.textObject.setText(this.fullText);
                if (this.typeTextEvent) {
                    this.typeTextEvent.remove(false);
                }
            } else {
                this.nextText();
            }

            // Deshabilitar el progreso temporalmente
            this.canProgress = false;
            this.time.delayedCall(300, () => {
                this.canProgress = true;
            });
        });

        // Eliminamos el evento de click
        
        this.nextText();
    }

    typeText() {
        let i = 0;
        if (this.typeTextEvent) {
            this.typeTextEvent.remove(false);
        }
        
        this.typeTextEvent = this.time.addEvent({
            delay: this.timeBetweenLetters,
            repeat: this.fullText.length - 1,
            callback: () => {
                if (!this.typing) return; // Si ya no estamos escribiendo, no hacer nada
                this.displayedText += this.fullText[i];
                this.textObject.setText(this.displayedText);
                i++;
                if (i >= this.fullText.length) {
                    this.typing = false;
                }
            }
        });
    }

    nextText() {
        if (this.textIndex < this.texts.length) {
            // Fade out de la imagen anterior si existe
            if (this.textIndex > 0) {
                this.tweens.add({
                    targets: this.backgrounds[this.textIndex - 1],
                    alpha: 0,
                    duration: 1000
                });
            }

            // Fade in de la nueva imagen
            this.tweens.add({
                targets: this.backgrounds[this.textIndex],
                alpha: 1,
                duration: 1000
            });

            // escribe el siguiente texto
            this.fullText = this.texts[this.textIndex];
            this.displayedText = "";
            this.textObject.setText("");
            this.typing = true;
            this.textIndex++;
            this.typeText();
        } else {
            if (this.typeTextEvent) {
                this.typeTextEvent.remove(false);
            }
            // Fade out final antes de cambiar de escena
            this.cameras.main.fadeOut(1000);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("Intro");
            });
        }
    }
}
