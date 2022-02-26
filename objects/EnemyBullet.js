class EnemyBullet extends GameObject {
	constructor() {
		super();
		this.width = 24;
		this.height = 24;
		this.MAX_FRAMES = 1;
		this.MAX_ANIMATION_DELAY = 30;
		this.ySpeed = 1;
	}
}