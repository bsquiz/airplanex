class Display {
	constructor() {
		this.isDebug = false;
		this.$playArea = document.getElementById('playArea');
		this.$background = document.getElementById('background');
		this.$foreground = document.getElementById('foreGround');
		this.$score = document.getElementById('score');
		this.$lives = document.getElementById('lives');
		this.$menu = document.getElementById('menu');
		this.$highScore = document.getElementById('highScore');
		this.$gameWrapper = document.getElementById('gameWrapper');
		this.playAreaContext = {};
		this.backgroundContext = {};
		this.foregroundContext = {};

		this.loader = new ResourceLoader(
			[
			'ship',
			'island1',
			'island2',
			'island3',
			'bullet',
			'enemy_bullet',
			'saucer',
			'coin',
			'coin_upgrade',
			'explosion',
			'shield',
			'saucer_upgraded',
			'pickup_shield'
			],
			'image',
			'img',
			'png'
			);

		this.LIFE_ICON_WIDTH = 16;
	}

	init(isDebug) {
		this.isDebug = isDebug;
		this.$playArea.width = Utils.WIDTH;
		this.$playArea.height = Utils.HEIGHT;
		this.$background.width = Utils.WIDTH;
		this.$background.height = Utils.HEIGHT;
		this.$foreground.width = Utils.WIDTH;
		this.$foreground.height = Utils.HEIGHT;

		this.playAreaContext = this.$playArea.getContext('2d');
		this.backgroundContext = this.$background.getContext('2d');
		this.foregroundContext = this.$foreground.getContext('2d');

		this.playAreaContext.strokeStyle = 'white';
		this.loader.loadFiles();
	}

	updateHighScore(score) {
		this.$highScore.innerHTML = `high score: ${score}`;
	}

	showMenu() {
		this.$menu.classList.remove('d-none');
		this.$gameWrapper.classList.add('d-none');
	}

	drawHUD(score, lives) {
		this.$score.innerHTML = score;
		this.$lives.style.width = `${lives * this.LIFE_ICON_WIDTH}px`;
	}
	drawImage(
		ctx, imageName,
		sourceX, sourceY, sourceWidth, sourceHeight,
		x, y, width, height
		) {
			if (this.isDebug) {
				ctx.strokeRect(x, y, width, height);
			}
			ctx.drawImage(
				this.loader.files.get(imageName),
				sourceX, sourceY, sourceWidth, sourceHeight,
				x, y, width, height
			);
	}
	drawGameObject(gameObject, imageName, isAnimating = false, alpha = 1, rotate = false, ctx = this.playAreaContext) {
		const { x, y, width, height, dir, leadingHitbox } = gameObject;

		let sourceX = 0;

		if (isAnimating) {
			let { frame } = gameObject;

			sourceX = width * frame;
		}

		ctx.save();
		ctx.translate(x, y);

		if (rotate) {
			ctx.translate(Math.floor(width / 2), Math.floor(height / 2));
			ctx.rotate(dir);
		}

		if (alpha !== 1) {
			ctx.globalAlpha = alpha;
		}

		this.drawImage(
			ctx, imageName,
			sourceX, 0, width, height,
			0, 0, width, height
		);

		ctx.restore();

		if (this.isDebug) {
			ctx.strokeStyle = 'red';
			ctx.strokeRect(leadingHitbox.x, leadingHitbox.y, leadingHitbox.width, leadingHitbox.height);
						ctx.strokeStyle = 'green';
			const boxes = gameObject.getPerimeterHitBoxes();
			boxes.forEach(box => {
				ctx.strokeRect(box.x, box.y, box.width, box.height);
			});

			ctx.strokeStyle = 'white';
		}
	}

	draw(game) {
		const { ship, bullets, enemyBullets,
			background, shieldPickup, enemyWaves, coins, explosions, currentWave } = game;
		let { hasShield, isInvincible, isAnimating } = ship;

		const activeExplosions = explosions.filter(explosion => explosion.isActive);
		const activeBullets = bullets.filter(bullet => bullet.isActive);
		const activeCoins = coins.filter(coin => coin.isActive);
		const activeEnemyBullets = enemyBullets.filter(enemyBullet => enemyBullet.isActive);

		this.playAreaContext.clearRect(0, 0, Utils.WIDTH, Utils.HEIGHT);
		this.backgroundContext.clearRect(0, 0, Utils.WIDTH, Utils.HEIGHT);

		this.drawGameObject(ship, 'ship', isAnimating, (isInvincible) ? 0.5 : 1, false);

		if (shieldPickup.isActive) {
			const { isAnimating, aliveTime, isUpgraded } = shieldPickup;
			const adjustAlpha = aliveTime > shieldPickup.ALIVE_TIME_TRANSPARENT;
			const dif = (shieldPickup.TOTAL_ALIVE_TIME - aliveTime) * 0.01;
			let imageName = 'pickup_shield';

			this.drawGameObject(shieldPickup, imageName, isAnimating, dif, false);
		}

		if (hasShield) {
			const { x, y, width, height } = ship;

			this.playAreaContext.drawImage(this.loader.files.get('shield'), x - width / 2, y - height / 3, 96, 96);
		}
		activeBullets.forEach(bullet => {
			this.drawGameObject(bullet, 'bullet');
		});
				activeEnemyBullets.forEach(bullet => {
			this.drawGameObject(bullet, 'enemy_bullet', true);
		});
		activeCoins.forEach(coin => {
			const { isAnimating, aliveTime, isUpgraded } = coin;
			const adjustAlpha = aliveTime > coin.ALIVE_TIME_TRANSPARENT;
			const dif = (coin.TOTAL_ALIVE_TIME - aliveTime) * 0.01;
			let imageName = 'coin';

			this.drawGameObject(coin, imageName, isAnimating, dif, false);
		});
		enemyWaves[currentWave].getActiveEnemies().forEach(enemy => {
			const { type } = enemy;
			let imageName = '';
			switch(type) {
				case Utils.EnemyType.SAUCER:
				imageName = 'saucer';
				break;
				case Utils.EnemyType.SAUCER_UPGRADED:
				imageName = 'saucer_upgraded';
				break;
				default:
				imageName = 'saucer';
				break;
			}
			this.drawGameObject(enemy, imageName, true, 1, false);
		});
		activeExplosions.forEach(explosion => {
			const { isAnimating } = explosion;

			this.drawGameObject(explosion, 'explosion', isAnimating);
		});
		background.islands.forEach(island => {
			const { x, y, width, height, type } = island;
			this.backgroundContext.drawImage(this.loader.files.get(`island${type}`), x, y, width, height);
		});
	}
}