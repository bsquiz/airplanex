class Level {
	constructor() {
		this.TOTAL_WAVES = 4;
		this.enemyWaves = []
		
		const enemy = new Enemy();
		const { width, height } = enemy;
		function straight() {
			this.x += this.xSpeed;
		}
		function zigZag() {
			if (!this.goWest) {
				this.turn(Utils.DirectionRadian.SOUTH_EAST);
				if (this.x + (this.width * 2) > Utils.WIDTH) {
					this.goWest = true;
				}
			} else {
				this.turn(Utils.DirectionRadian.SOUTH_WEST);
				if (this.x < 0) {
					this.goWest = false;
				}
			}
		}

		function bankEast() {
			if (this.y > Utils.HEIGHT / 4) {
				if (this.xSpeed < 2) {
					this.xSpeed += 0.01;
				}	
			}
		}
		function bankWest() {
			if (this.y > Utils.HEIGHT / 4) {
				if (this.xSpeed > -2) {
					this.xSpeed -= 0.01;
				}	
			}
		}
		function crossEast() {
			if (this.x < Utils.WIDTH - this.width) {
				bankEast.apply(this);
			} else {
				this.decelerateX();
			}
		}
		function crossWest() {
			if (this.x > Utils.WIDTH + this.width) {
				bankWest.apply(this);
			} else {
				this.decelerateX();
			}
		}

		this.enemyWaves.push(
			new EnemyWave(
					[
			new SaucerUpgraded(100, 0, straight)

					]
				)
			);
			this.enemyWaves.push(
				new EnemyWave(
					[
					...this.makeHorizontalLine(enemy.width, 0, 4, width * 1.5, Utils.EnemyType.SAUCER, straight)
					],700));

				this.enemyWaves.push(
			new EnemyWave([
				...this.makeLine(enemy.width, 0, 5, height, Utils.EnemyType.SAUCER, zigZag)
				], 950));
		this.enemyWaves.push(
			new EnemyWave([
				...this.makeLine(enemy.width / 2, 0, 5, height, Utils.EnemyType.SAUCER, crossEast),
				...this.makeLine(Utils.WIDTH - enemy.width * 2, 0, 5, height, Utils.EnemyType.SAUCER, bankWest)
				], 600)
		);


		this.enemyWaves.push(
			new EnemyWave(this.makeLine(width, 0, 5, height, Utils.EnemyType.SAUCER, crossEast), 500)
		);

	}
	
	makeHorizontalLine(startX, startY, numEnemies, xOffset, enemyType, behavior) {
		const enemies = [];

		for (let i=0; i<numEnemies; i++) {
			enemies.push(new Enemy(startX + (xOffset * i), startY, enemyType, behavior));
		}

		return enemies;
	}
	makeLine(startX, startY, numEnemies, height, enemyType, behavior) {
		const enemies = [];

		for (let i=0; i<numEnemies; i++) {
			enemies.push(new Enemy(startX, startY - (i * height), enemyType, behavior));
		}

		return enemies;
	}
}