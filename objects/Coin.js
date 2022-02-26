class Coin extends Pickup {
	constructor() {
		super(Utils.PickupType.COIN);
		this.width = 16;
		this.height = 16;
		this.MAX_FRAMES = 3;
		this.points = 100;
	}
}