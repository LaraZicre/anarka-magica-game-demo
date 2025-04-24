export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
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


    this.enemy = this.physics.add.sprite(600, 400, "enemy");
    this.enemy.body.immovable = true;
    this.enemy.setImmovable(true); // No lo empuja el jugador
    this.physics.add.collider(this.enemy, floorLayer); 

    this.enemyReacted = false;
    this.dialogueCompleted = false; // Nueva bandera para controlar si el diálogo ya se completó

    this.physics.add.overlap(this.player, this.enemy, () => {
      if (!this.dialogueActive && !this.dialogueCompleted) { // Verificar si el diálogo no se ha completado
        this.startDialogue();
    
        if (!this.enemyReacted) {
          this.enemy.play("enemyReact");
          this.enemyReacted = true;
        }
      }
    }, null, this);
    



    

    //dialogo

    this.dialogueLines = [
      { speaker: "player", text: "¡Ey, vos! ¿Qué hacés acá?" },
      { speaker: "enemy", text: "Podría preguntarte lo mismo..." },
      { speaker: "player", text: "No pareces muy amistoso..." },
      { speaker: "enemy", text: "Ni vos muy listo por venir hasta acá." }
    ];
    this.dialogueIndex = 0;
    this.dialogueActive = false;

    // Crear el cuadro de diálogo en el centro de la pantalla
    this.dialogueBox = this.add.rectangle(400, 300, 700, 100, 0x000000, 0.7).setOrigin(0.5);
    
    // Ajustar el texto para que esté dentro del cuadro
    this.dialogueText = this.add.text(400, 300, "", {
      fontSize: "20px",
      fill: "#ffffff",
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // Posicionar el nombre del hablante justo encima del texto
    this.dialogueSpeaker = this.add.text(400, 250, "", {
      fontSize: "16px",
      fill: "#aaaaaa",
    }).setOrigin(0.5);

    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.dialogueSpeaker.setVisible(false);




    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  }

  startDialogue() {
    this.dialogueActive = true;
    this.dialogueIndex = 0;
  
    this.player.body.enable = false; // Desactiva movimiento
    this.enemy.body.enable = false;
  
    this.dialogueBox.setVisible(true);
    this.dialogueText.setVisible(true);
    this.dialogueSpeaker.setVisible(true);
  
    this.showNextLine();
  }
  
  showNextLine() {
    if (this.dialogueIndex < this.dialogueLines.length) {
      const line = this.dialogueLines[this.dialogueIndex];
      this.dialogueText.setText(line.text);
      this.dialogueSpeaker.setText(line.speaker === "player" ? "Tú:" : "???");
  
      this.dialogueIndex++;
    } else {
      this.endDialogue();
    }
  }
  
  endDialogue() {
    this.dialogueActive = false;
    this.dialogueCompleted = true; // Marcar el diálogo como completado
  
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.dialogueSpeaker.setVisible(false);
  
    this.player.body.enable = true;
    this.enemy.body.enable = true;

    // Iniciar la transición a la escena de pelea
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Fight');
    });
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

    if (this.dialogueActive && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.showNextLine();
    }
    
  }
}
