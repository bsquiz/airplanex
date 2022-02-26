class Ship extends GameObject {
	constructor() {
		super();
		this.MAX_SHOOT_TIMER = 25;
		this.canShootTimer = this.MAX_SHOOT_TIMER;
		this.lives = 3;

		this.MAX_INVINCIBLE_TIMER = 100;
		this.invincibleTimer = this.MAX_INVINCIBLE_TIMER;

	}
	resetPosition() {
		this.x = Utils.WIDTH / 2 - this.width / 2;
		this.y = Utils.HEIGHT - this.height * 2;
	}
	reset() {
		super.reset();
		this.hasShield = false;
		this.canShoot = true;
		this.isInvincible = false;
				this.isAnimating = false;
		this.frame = 0;
		this.invincibleTimer = this.MAX_INVINCIBLE_TIMER;
		this.turn(Utils.degToRad(Utils.Direction.NORTH));
	}
	thrust(dir) {
		this.isMoving = true;
		this.turn(dir);
		if (this.xSpeed > 0) {
			this.frame = 1;
		} else if (this.xSpeed < 0) {
			this.frame = 2;
		}
	}

	update() {
		super.update();
		this.canShootTimer--;
		if (this.canShootTimer === 0) {
			this.canShootTimer = this.MAX_SHOOT_TIMER;
			this.canShoot = true;
		}

		if (this.isInvincible) {
			this.invincibleTimer--;

			if (this.invincibleTimer === 0) {
				this.isInvincible = false;
				this.invincibleTimer = this.MAX_INVINCIBLE_TIMER;
			}
		}
	}
}