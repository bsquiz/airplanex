class Triangle extends Enemy {
	constructor(originalX, originalY, behavior) {
		super(originalX, originalY, behavior);
		this.type = Utils.EnemyType.TRIANGLE;
		this.maxSpeed = 2;
	}
}