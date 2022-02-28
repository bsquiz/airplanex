const game = {
	State: {
		MENU: 0,
		PLAYING: 1,
		GAME_OVER: 2,
		PAUSE: 3
	},
	keysDown: {
		'ArrowUp': false,
		'ArrowDown': false,
		'ArrowRight': false,
		'ArrowLeft': false,
		'Space': false
	},
	enemyWaves: [],
	levels: [],
	currentLevel: 0,
	state: 0,
	isRunning: true,
	currentFrame: 0,
	currentWave: 0,
	display: new Display(),
	audio: new AudioPlayer(),
	background: new Background(),
	foreground: {},
	ship: new Ship(),
	shieldPickup: new Pickup(Utils.PickupType.SHIELD),
	bullets: [],
	enemyBullets: [],
	coins: [],
	explosions: [],
	score: 0,
	imagesLoaded: false,
	audioLoaded: false,
	isLoaded: false,
	isDebug: false,
	isMobile: false,

	gameOver() {
		this.state = this.State.GAME_OVER;
		this.saveHighScore(this.score);
		this.display.updateHighScore(game.getHighScore());
		this.display.showMenu();
	},

	spawnGameObject(x, y, gameObjects) {
		for (let i=0; i<gameObjects.length; i++) {
			const gameObject = gameObjects[i];

			if (!gameObject.isActive) {
				gameObject.reset();
				gameObject.activate();
				gameObject.x = x - Math.floor(gameObject.width / 2);
				gameObject.y = y;

				return gameObject;
			}	
		}
	},

	updateBullets() {
		const activeBullets = this.bullets.filter(bullet => bullet.isActive);

		activeBullets.forEach(bullet => {
			bullet.update();
			if (bullet.y < 0) {
				bullet.isActive = false;
			}
		});
	},

	updateEnemyBullets() {
		const activeBullets = this.enemyBullets.filter(bullet => bullet.isActive);

		activeBullets.forEach(bullet => {
			bullet.update();

			if (Utils.objectReachedBounds(bullet)) {
				bullet.reset();
			}

			this.hitTestShip(bullet);
		});
	},

	checkCanShoot() {
		if (this.isMobile) {
			return this.ship.canShoot;
		}

		return this.keysDown[Utils.Keys.SPACE]
			&& this.ship.canShoot;
	},

	checkMovementDir() {
		let dir = -1;

		if (this.keysDown[Utils.Keys.UP]) {
			dir = Utils.Angle.DOWN;
		} else if (this.keysDown[Utils.Keys.DOWN]) {
			dir = Utils.Angle.UP;
		} else if (this.keysDown[Utils.Keys.LEFT]) {
			dir = Utils.Angle.LEFT;
		} else if (this.keysDown[Utils.Keys.RIGHT]) {
			dir = Utils.Angle.RIGHT;
		}

		return dir;
	},

	hitTestShip(hitTestObject) {
		if (!this.ship.isInvincible) {
			let isHit = false;
			const hitBoxes = this.ship.getPerimeterHitBoxes();

			for (let i=0; i<hitBoxes.length; i++) {
				if (Utils.hitTest(hitBoxes[i], hitTestObject)) {
					isHit = true;
					break;
				}
			}
			if (isHit) {
				if (this.ship.hasShield) {
					this.ship.hasShield = false;
					this.ship.isInvincible = true;
				} else {
					this.spawnGameObject(this.ship.x, this.ship.y, this.explosions);
					this.ship.lives--;
					this.display.drawHUD(this.score, this.ship.lives);
					this.ship.isInvincible = true;
					this.ship.resetPosition();
					this.audio.play(this.audio.Sound.EXPLOSION);

					if (this.ship.lives === 0) {
						this.gameOver();
					}
				}
			}
		}
	},
	updateEnemies() {
		const { enemies } = this.enemyWaves[this.currentWave];
		const activeEnemies = enemies.filter(enemy => enemy.isActive);
		const activeBullets = this.bullets.filter(bullet => bullet.isActive);
		const currentEnemyWave = this.enemyWaves[this.currentWave];

		currentEnemyWave.update();
		if (currentEnemyWave.isComplete()) {
			this.advanceNextWave();
		}

		activeEnemies.forEach(enemy => {

			if (enemy.shouldShoot) {
				const bullet = this.spawnGameObject(enemy.x, enemy.y, this.enemyBullets);
				if (bullet) {
					bullet.turn(
					Utils.turnTowardsPoint(enemy.x, enemy.y, this.ship.x, this.ship.y)
				);
				}
			}

			activeBullets.forEach(bullet => {
				if (Utils.hitTest(bullet, enemy)) {
					bullet.isActive = false;

					if (enemy.takeDamage(1)) {
						const pickupType = Math.floor(Math.random() * 100);
						let pickup;

						this.spawnGameObject(enemy.x, enemy.y, this.explosions);

						if (pickupType === 0) {
							pickup = this.shieldPickup;
							pickup.reset();
							pickup.activate();
							pickup.x = enemy.x;
							pickup.y = enemy.y;
						} else {
							pickup = this.spawnGameObject(enemy.x, enemy.y, this.coins);
						}

						this.score += enemy.points;
						this.display.drawHUD(this.score, this.ship.lives);
						enemy.reset();
						this.audio.play(this.audio.Sound.EXPLOSION);

						if (pickup) {
							pickup.turn(Utils.randomMagnitude(Math.PI));
						}
					}
				}
			});

			this.hitTestShip(enemy);
		});
	},
	updatePickups() {
		const activePickups = this.coins.filter(coin => coin.isActive);

		if (this.shieldPickup.isActive) {
			activePickups.push(this.shieldPickup);
		}

		activePickups.forEach(pickup => {
			if (Utils.objectReachedBounds(pickup)) {
				pickup.mirrorReflect();
			}

			pickup.update();

			if (Utils.hitTest(pickup, this.ship)) {
				const { type } = pickup;

				if (type === Utils.PickupType.COIN) {
					this.score += pickup.points;
					this.display.drawHUD(this.score);
				} else {
					this.shieldPickup.reset();
					this.ship.hasShield = true;
				}

				pickup.reset();
				this.audio.play(this.audio.Sound.COIN);
			}
		});
	},
	updateExplosions() {
		this.explosions.forEach(explosion => {
			if (explosion.isActive) {
				explosion.update();
			}
		});
	},
	updateShip() {
		let rad = 0;
		
		if (Utils.objectLeadingHitboxReachedBounds(this.ship)) {
			//this.ship.constrainPosition(Utils.WIDTH, Utils.HEIGHT, 10, 10);
			//this.ship.stop();
			this.ship.bounceBack();

			return;
		}

			this.ship.update();

		if (this.checkCanShoot()) {
			this.spawnGameObject(
			Math.floor(this.ship.x + this.ship.width / 2), this.ship.y,
				this.bullets
			);
			this.ship.canShoot = false;
			if (!this.isMobile) {
				this.audio.play(this.audio.Sound.SHOT);
			}
		}

		const dir = this.checkMovementDir();

		if (dir === -1) {
			this.ship.stop();
			return;
		}

		rad = Utils.normalizeDegrees(dir) * (Math.PI / 180);
		game.ship.thrust(rad);

	},

	update() {
		if (!this.isLoaded) {
			window.requestAnimationFrame(() => game.update());
			return;
		}

		if (this.isRunning) {
			this.currentFrame++;
			switch (this.state) {
				case this.State.PLAYING:
					this.updateShip();
					this.updateEnemies();
					this.updateBullets();
					this.updateEnemyBullets();
					this.updateExplosions();
					this.updatePickups();
					this.background.update();
					this.display.draw(this);
				break;

				case this.State.GAME_OVER:

				break;
			}

			window.requestAnimationFrame(() => game.update());
		}
	},
	reset() {
		this.isMobile = window.matchMedia('max-width: 900px').matches;
		this.enemyWaves = [];
		this.levels = [];
		this.state = 0;
		this.currentFrame = 0;
		this.currentWave = 0;
		this.ship = new Ship();
		this.bullets = [];
		this.enemyBullets = [];
		this.coins = [];
		this.explosions = [];
		this.score = 0;
		for (let i = 0; i<10; i++) {
			this.explosions.push(new Explosion());
			this.coins.push(new Coin());
			this.bullets.push(new Bullet());
			this.enemyBullets.push(new EnemyBullet());
		}

		this.levels.push(new Level());
		this.enemyWaves = this.levels[0].enemyWaves;
		this.display.init(this.isDebug);
		this.audio.init();

		this.ship.resetPosition();

		this.ship.maxSpeed = 5; // test
		this.enemyWaves[this.currentWave].activate();
		this.display.drawHUD(this.score, this.ship.lives);
	},
	start() {
		this.reset();
		this.state = this.State.PLAYING;
	},

	advanceNextWave() {
		this.enemyWaves[this.currentWave].reset();

		this.currentWave++;
		if (this.currentWave + 1 > this.levels[this.currentLevel].TOTAL_WAVES) {
			this.currentWave = 0;
		}
		this.enemyWaves[this.currentWave].activate();
	},
	getHighScore() {
		return window.localStorage.getItem('airplaneX_highscore') || 0;
	},
	saveHighScore(score) {
		const oldScore = this.getHighScore();

		if (oldScore < score) {
			window.localStorage.setItem('airplaneX_highscore', score);
		}
	}
};