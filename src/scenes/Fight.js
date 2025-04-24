export default class Fight extends Phaser.Scene {
    constructor() {
      super("Fight");
    }
  
    preload() {}
  
    create() {

      this.add.image(400, 300, "fondopelea");

      // Configurar el fondo con parallax
      this.bg = this.add.tileSprite(0, 0, 800, 600, 'parallax');
      this.bg.setOrigin(0, 0);
      
      // Variables para el efecto parallax
      this.parallaxSpeed = 0.5;
      this.parallaxDirection = 1;
      this.parallaxTimer = 0;
      this.parallaxInterval = 4000; // 4 segundos para cambiar de dirección

      this.add.image(400, 300, "pelea");

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
      this.consecutiveSuccesses = 0; // Contador de combos exitosos consecutivos

      // Crear el recuadro negro para el combo
      this.comboBackground = this.add.rectangle(400, 500, 600, 50, 0x000000).setOrigin(0.5);
      this.comboBackground.setStrokeStyle(2, 0x333333); // Agregar un borde gris oscuro
      
      this.comboText = this.add.text(400, 500, "", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
      this.updateComboText(); // Actualizar el texto del combo inmediatamente después de crearlo
      this.comboText.setVisible(false); // Oculta al inicio
      this.comboBackground.setVisible(false); // También ocultar el fondo al inicio

      this.playerProgress = 0;
      this.progressBarBg = this.add.rectangle(50, 30, 300, 30, 0x555555).setOrigin(0);
      this.progressBar = this.add.rectangle(50, 30, 0, 30, 0x00ff00).setOrigin(0);
      this.add.text(50, 10, "Jugador", { fontSize: "16px", fill: "#fff" });

      this.enemyProgress = 0;
      this.enemyBarBg = this.add.rectangle(450, 30, 300, 30, 0x555555).setOrigin(0);
      this.enemyBar = this.add.rectangle(450, 30, 0, 30, 0xff0000).setOrigin(0);
      this.add.text(450, 10, "Enemigo", { fontSize: "16px", fill: "#fff" });

      this.gameTimer = 0;
      this.minGameTime = 120000; // 120 segundos (2 minutos) en milisegundos
      this.timerText = this.add.text(400, 300, "Tiempo: 120", { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);
      this.timerText.setVisible(false); // Ocultar el temporizador al inicio

      this.enemyAttackInterval = 2000; // Ataca cada 2 segundos
      this.lastEnemyAttack = 0;
      this.enemyAttackAmount = 5; // Cantidad de progreso por ataque

      this.battleStarted = false;

      // Cuenta regresiva
      this.countdownTime = 5;
      this.countdownText = this.add.text(400, 300, "5", { fontSize: "64px", fill: "#ffff00" }).setOrigin(0.5);

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
            this.timerText.setVisible(true); // Mostrar el temporizador después del YA!
            this.startBattle();
          }
        },
        callbackScope: this
      });
    }

    startBattle() {
      this.battleStarted = true;
      this.comboText.setVisible(true);
      this.comboBackground.setVisible(true); // Mostrar el fondo cuando empiece la batalla
      this.updateComboText();
      this.input.keyboard.on("keydown", this.handleInput, this);
    }

    generateNewCombo() {
      const combo = [];
      // Aumentar la longitud del combo basado en el progreso del jugador
      const baseLength = 3;
      const extraLength = Math.floor(this.playerProgress / 25); // Cada 25% de progreso aumenta la longitud
      const comboLength = Math.min(baseLength + extraLength, 6); // Máximo 6 teclas
      
      for (let i = 0; i < comboLength; i++) {
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
          // Sistema de progreso basado en combos consecutivos
          this.consecutiveSuccesses++;
          let progressGain = 5; // Progreso base por combo completado

          // Bonificación por combos consecutivos
          if (this.consecutiveSuccesses >= 3) progressGain += 2;
          if (this.consecutiveSuccesses >= 5) progressGain += 3;
          
          this.playerProgress = Math.min(100, this.playerProgress + progressGain);
          this.comboIndex = 0;
          this.currentCombo = this.generateNewCombo();
          this.updateComboText();
        }
      } else {
        // Penalización por error
        this.comboIndex = 0;
        this.consecutiveSuccesses = 0;
        this.playerProgress = Math.max(0, this.playerProgress - 2);
        this.currentCombo = this.generateNewCombo();
        this.updateComboText();
      }
    }

    showEndGamePopup(message) {
      // Crear un fondo semi-transparente negro
      const overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7);
      overlay.setOrigin(0, 0);

      // Crear un contenedor para el mensaje
      const popupBg = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.8);
      popupBg.setStrokeStyle(4, 0xffffff);

      // Agregar el texto
      const text = this.add.text(400, 300, message, {
        fontSize: '48px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Esperar 2 segundos antes de cambiar de escena
      this.time.delayedCall(2000, () => {
        if (message === '¡Ganaste!') {
          this.scene.start("Level1");
        } else {
          this.scene.start("GameOver");
        }
      });
    }

    update(time, delta) {
      if (!this.battleStarted) return;

      // Actualizar el efecto parallax
      this.parallaxTimer += delta;
      if (this.parallaxTimer >= this.parallaxInterval) {
        this.parallaxDirection *= -1; // Cambiar dirección
        this.parallaxTimer = 0;
      }
      this.bg.tilePositionX += this.parallaxSpeed * this.parallaxDirection;

      this.gameTimer += delta;
      const remainingTime = Math.max(0, Math.ceil((this.minGameTime - this.gameTimer) / 1000));
      this.timerText.setText(`Tiempo: ${remainingTime}`);

      // Calcular el ancho de las barras proporcionalmente
      const maxWidth = 300; // El ancho máximo de las barras de fondo
      this.progressBar.width = Math.min(maxWidth, (this.playerProgress / 100) * maxWidth);
      this.enemyBar.width = Math.min(maxWidth, (this.enemyProgress / 100) * maxWidth);

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
        this.battleStarted = false; // Detener el juego
        this.showEndGamePopup('¡Ganaste!');
      } else if (this.enemyProgress >= 100) {
        this.battleStarted = false; // Detener el juego
        this.showEndGamePopup('¡Perdiste!');
      }
    }
  }