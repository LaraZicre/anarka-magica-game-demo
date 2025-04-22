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

    this.physics.add.overlap(this.player, this.enemy, () => {
      if (!this.dialogueActive) {
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

    this.dialogueBox = this.add.rectangle(400, 500, 700, 80, 0x000000, 0.7);
    this.dialogueText = this.add.text(130, 475, "", {
      fontSize: "16px",
      fill: "#ffffff",
      wordWrap: { width: 600 }
    });
    this.dialogueSpeaker = this.add.text(60, 475, "", {
      fontSize: "14px",
      fill: "#aaaaaa",
    });

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
  
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.dialogueSpeaker.setVisible(false);
  
    this.player.body.enable = true;
    this.enemy.body.enable = true;
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
