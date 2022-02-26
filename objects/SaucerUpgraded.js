class SaucerUpgraded extends Enemy {
	constructor(originalX, originalY, behavior) {
		super(originalX, originalY,
			Utils.EnemyType.SAUCER_UPGRADED,
			behavior);
		this.TOTAL_HP = 10;
		this.MAX_SHOOT_TIME = 200;

		this.reset();
	}

	reset() {
		super.reset();
		this.totalShootTimer = this.MAX_SHOOT_TIME;
		this.shouldShoot = false;
	}
	update() {
		super.update();
		if (this.shouldShoot) this.shouldShoot = false;
		this.totalShootTimer--;
		if (this.totalShootTimer === 0) {
			this.totalShootTimer = this.MAX_SHOOT_TIME;
			this.shouldShoot = true;
		}
	}
}