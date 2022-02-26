const Utils = {
	WIDTH: 300,
	HEIGHT: 500,
	Keys: {
		'UP': 'ArrowUp',
		'DOWN': 'ArrowDown',
		'LEFT': 'ArrowLeft',
		'RIGHT': 'ArrowRight',
		'SPACE': 'Space'
	},
	Angle: {
		'UP': 0,
		'DOWN': 180,
		'RIGHT': 90,
		'LEFT': 270
	},
	PickupType: {
		COIN: 0,
		SHIELD: 1
	},
	EnemyType: {
		SAUCER: 0,
		SAUCER_UPGRADED: 1
	},
	DirectionRadian: {
		NORTH: 4.7, //6.3,
		NORTH_EAST: 3.9, //0.8,
		EAST: 3.1, //1.6,
		SOUTH_EAST: 2.4,
		SOUTH: 1.6,
		SOUTH_WEST: 0.8, //3.9,
		WEST: 6.3, //4.7,
		NORTH_WEST: 5.5
	},
	Direction: {
		NORTH: 180,
		SOUTH: 0,
		EAST: 90,
		WEST: 270,
		SOUTH_EAST: 45,
		NORTH_EAST: 135,
		SOUTH_WEST: 315
	},
	numberInRange(val, max, min = 0) {
		return (val > min && val < max);
	},
	clampDegreesToCardinal(dir) {
		// clamp to cardinal directions
		let clampedDir = Math.abs(dir);
		let cardinalDir = 0;

		if (this.numberInRange(clampedDir, 91, 0)) {
			cardinalDir = 90;
		} else if (this.numberInRange(clampedDir, 181,  89)) {
			cardinalDir = 180;
		} else if (this.numberInRange(clampedDir, 271, 179)) {
			cardinalDir = 270;
		}

		return cardinalDir;
	},
	randomMagnitude(max) {
		const x = Math.floor(Math.random() * 2);
		const mag = Math.random() * max;

		return (x) ? mag * -1 : mag;
	},
	normalizeDegrees(degrees) {
		return degrees + 90;
	},
	degToRad(dir) {
		let rad = 0;
		rad = dir * (Math.PI / 180);

		return rad;
	},
	radToDeg(rad) {
		let deg = 0;
		deg = rad * (180 / Math.PI);

		return deg;
	},
	turnTowardsPoint(objectX, objectY, targetX, targetY) {
		const rads = Math.atan2(targetY - objectY , targetX - objectX);
		
		return rads;
	},
	reachedScreenBounds(x, y) {
		const hitWestBounds = x <= 0;
		const hitEastBounds = x >= this.WIDTH;
		const hitNorthBounds = y <= 0;
		const hitSouthBounds = y >= this.HEIGHT;

		return (hitNorthBounds || hitSouthBounds || hitEastBounds || hitWestBounds);
	},
	objectReachedBounds(gameObject) {
		const { x, y } = gameObject.getFuturePosition();

		return this.reachedScreenBounds(x, y);
	},
	objectCenterReachedBounds(gameObject) {
		const hitBox = gameObject.getCenterHitBox();
		const { x, y } = gameObject.getFuturePosition(hitBox.x, hitBox.y);

		return this.reachedScreenBounds(x, y);
	},
	objectLeadingHitboxReachedBounds(gameObject) {
		const { leadingHitbox } = gameObject;
		const { x, y } = gameObject.getFuturePosition(leadingHitbox.x, leadingHitbox.y);

		return this.reachedScreenBounds(x, y);
	},
	hitTest(gameObject1, gameObject2) {
		const xContained =
			gameObject1.x > gameObject2.x
			&& gameObject1.x < gameObject2.x + gameObject2.width;
		const yContained =
			gameObject1.y > gameObject2.y
			&& gameObject1.y < gameObject2.y + gameObject2.height;

		return (xContained && yContained);
	}
}