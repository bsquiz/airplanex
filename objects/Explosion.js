class Explosion extends GameObject {
	constructor() {
		super();
		this.width = 48;
		this.height = 48;
		this.ySpeed = 0;
		this.MAX_FRAMES = 3;
		this.isAnimating = true;
		this.hasAliveTimer = true;
		this.TOTAL_ALIVE_TIME = this.MAX_FRAMES * this.MAX_ANIMATION_DELAY;
	}
}