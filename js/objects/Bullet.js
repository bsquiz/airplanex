class Bullet extends GameObject {
	constructor() {
		super();
		this.width = 16;
		this.height = 16;
		this.ySpeed = -16;
		this.xSpeed = 0;
	}

	reset(x, y) {
		this.x = x;
		this.y = y;
	}
}