class EnemyWave {
	constructor(enemies, totalTime) {
		this.enemies = enemies;
		this.MAX_TOTAL_TIME = totalTime;
		this.reset();
	}

	getActiveEnemies() {
		return this.enemies.filter(enemy => enemy.isActive);
	}

	activate() {
		this.isActive = true;
		this.enemies.forEach(enemy => {
			enemy.activate();
		});
	}
	reset() {
		this.allEnemiesDestroyed = false;
		this.totalTime = this.MAX_TOTAL_TIME;
		this.isActive = false;
		this.enemies.forEach(enemy => {
			enemy.reset();
		});
	}
	isComplete() {
		return this.totalTime === 0 || this.allEnemiesDestroyed;
	}
	update() {
		const activeEnemies = this.enemies.filter(enemy => enemy.isActive);

		if (this.totalTime > 0) this.totalTime--;

		if (activeEnemies.length === 0) {
			this.allEnemiesDestroyed = true;

			return;
		}

		activeEnemies.forEach(enemy => {
			enemy.update();
			if (enemy.y > Utils.HEIGHT) {
				enemy.reset();
			}
		});

	}
}