export default class Fight extends Phaser.Scene {
    constructor() {
      super("Fight");
    }
  
    preload() {}
  
    create() {
      this.availableKeys = ["LEFT", "RIGHT", "UP", "DOWN"];
      this.keyMap = {
        LEFT: "ArrowLeft",
        RIGHT: "ArrowRight",
        UP: "ArrowUp",
        DOWN: "ArrowDown"
      };
      this.prettyArrows = {
        LEFT: "←",
        RIGHT: "→",
        UP: "↑",
        DOWN: "↓"
      };
  
      this.currentCombo = this.generateNewCombo();
      this.comboIndex = 0;
  
      this.comboText = this.add.text(100, 100, "", { fontSize: "32px", fill: "#fff" });
      this.comboText.setVisible(false); // Oculta al inicio
  
      this.playerProgress = 0;
      this.progressBarBg = this.add.rectangle(100, 200, 300, 30, 0x555555).setOrigin(0);
      this.progressBar = this.add.rectangle(100, 200, 0, 30, 0x00ff00).setOrigin(0);
      this.add.text(410, 200, "Jugador", { fontSize: "16px", fill: "#fff" });
  
      this.enemyProgress = 0;
      this.enemyBarBg = this.add.rectangle(100, 250, 300, 30, 0x555555).setOrigin(0);
      this.enemyBar = this.add.rectangle(100, 250, 0, 30, 0xff0000).setOrigin(0);
      this.add.text(410, 250, "Enemigo", { fontSize: "16px", fill: "#fff" });
  
      this.gameTimer = 0;
      this.minGameTime = 60000; // 60 segundos en milisegundos
      this.timerText = this.add.text(50, 50, "Tiempo: 60", { fontSize: "24px", fill: "#fff" });
  
      this.enemyAttackInterval = 2000; // Ataca cada 2 segundos
      this.lastEnemyAttack = 0;
      this.enemyAttackAmount = 5; // Cantidad de progreso por ataque
  
      this.battleStarted = false;
  
      // Cuenta regresiva
      this.countdownTime = 5;
      this.countdownText = this.add.text(250, 150, "5", { fontSize: "64px", fill: "#ffff00" }).setOrigin(0.5);
  
      this.time.addEvent({
        delay: 1000,
        repeat: 5,
        callback: () => {
          this.countdownTime--;
          if (this.countdownTime > 0) {
            this.countdownText.setText(this.countdownTime);
          } else if (this.countdownTime === 0) {
            this.countdownText.setText("¡YA!");
          } else {
            this.countdownText.setVisible(false);
            this.startBattle();
          }
        },
        callbackScope: this
      });
    }
  
    startBattle() {
      this.battleStarted = true;
      this.comboText.setVisible(true);
      this.updateComboText();
      this.input.keyboard.on("keydown", this.handleInput, this);
    }
  
    generateNewCombo() {
      const combo = [];
      for (let i = 0; i < 3; i++) {
        combo.push(Phaser.Utils.Array.GetRandom(this.availableKeys));
      }
      return combo;
    }
  
    updateComboText() {
      const display = this.currentCombo.map(k => this.prettyArrows[k]).join(" ");
      this.comboText.setText("Combo: " + display);
    }
  
    handleInput(event) {
      if (!this.battleStarted) return;
  
      const expectedKey = this.currentCombo[this.comboIndex];
      const expectedCode = this.keyMap[expectedKey];
  
      if (event.code === expectedCode) {
        this.comboIndex++;
        if (this.comboIndex >= this.currentCombo.length) {
          this.playerProgress += 15;
          this.comboIndex = 0;
          this.currentCombo = this.generateNewCombo();
          this.updateComboText();
        }
      } else {
        this.comboIndex = 0;
        this.playerProgress = Math.max(this.playerProgress - 3, 0);
      }
    }
  
    update(time, delta) {
      if (!this.battleStarted) return;

      this.gameTimer += delta;
      const remainingTime = Math.max(0, Math.ceil((this.minGameTime - this.gameTimer) / 1000));
      this.timerText.setText(`Tiempo: ${remainingTime}`);

      this.progressBar.width = 3 * this.playerProgress;
      this.enemyBar.width = 3 * this.enemyProgress;

      // Sistema de ataque del enemigo por intervalos
      if (this.gameTimer - this.lastEnemyAttack >= this.enemyAttackInterval) {
        // Calcula el daño base según el tiempo transcurrido
        const timeRatio = Math.min(this.gameTimer / this.minGameTime, 1);
        let attackDamage = this.enemyAttackAmount;
        
        // Aumenta el daño gradualmente según el tiempo transcurrido
        if (timeRatio > 0.3) attackDamage += 1;
        if (timeRatio > 0.6) attackDamage += 1;
        if (timeRatio > 0.8) attackDamage += 1;

        this.enemyProgress += attackDamage;
        this.lastEnemyAttack = this.gameTimer;
      }

      // Solo permitir la victoria después del tiempo mínimo
      if (this.playerProgress >= 100 && this.gameTimer >= this.minGameTime) {
        this.scene.start("Level1");
      } else if (this.enemyProgress >= 100) {
        this.scene.start("GameOver");
      }
    }
  }