class Enemy extends GameObject {
	constructor(originalX, originalY, type, behavior) {
		super();
		this.points = 50;
		this.originalX = originalX;
		this.originalY = originalY;
		this.behavior = behavior;
		this.MAX_FRAMES = 5;
		this.type = type;
		this.reset();
		this.isAnimating = true;
		this.MAX_ANIMATION_DELAY = 20;
		this.TOTAL_HP = 2;
	}

	update() {
		if (this.behavior) {
			this.behavior.apply(this);
		}
		super.update();
	}

	reset() {
		super.reset();
		this.ySpeed = 1;
		this.xSpeed = 0;
		this.isMoving = true;
		this.x = this.originalX;
		this.y = this.originalY;
	}
}