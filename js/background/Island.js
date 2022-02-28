class Island extends GameObject {
	constructor(x = 0, y = 0, type = 1) {
		super();
		this.type = type;
		this.y = y;
		this.x = x;
		this.ySpeed = 0.5;
		this.isMoving = true;
		this.width = 128;
		this.height = 128;
	}
}