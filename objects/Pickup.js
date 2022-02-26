class Pickup extends GameObject {
	constructor(type) {
		super();
		this.type = type;
		this.width = 32;
		this.height = 32;
		this.MAX_FRAMES = 6;
		this.drag = 0.003;
		this.hasAliveTimer = true;
		this.TOTAL_ALIVE_TIME = 400;
		this.ALIVE_TIME_TRANSPARENT = 100;
	}
}