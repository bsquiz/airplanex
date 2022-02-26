class GameObject {
	constructor() {
		this.type = 0;
		this.width = 48;
		this.height = 48;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.maxSpeed = 1;
		this.frame = 0;
		this.hasAliveTimer = false;
		this.MAX_FRAMES = 1;
		this.animationDelay = 0;
		this.MAX_ANIMATION_DELAY = 10;
		this.TOTAL_HP = 1;
		this.drag = 0;
		this.leadingHitbox = {};
		this.reset();
	}

	reset() {
		this.isActive = false;
		this.isMoving = false;
		this.isAnimating = false;
		this.x = 0;
		this.y = 0;
		this.dir = 0;
		this.frame = 0;
		this.animationDelay = 0;
		this.aliveTime = 0;
		this.hp = this.TOTAL_HP;
	}

	takeDamage(amount) {
		this.hp -= amount;

		return this.hp <= 0;
	}
	
	getCenterHitBox() {
		return {
			x: this.x + this.width / 4,
			y: this.y + this.height / 4,
			width: 2,
			height: 2
		};
	}

	calculateLeadingHitbox() {
		let x;
		let y;
		
		x = this.x + this.width / 2;
		y = this.y + this.height / 2;
		x += this.xSpeed * 4;
		y += this.ySpeed * 4;

		return {
			x,
			y,
			width: 2,
			height: 2
		};
	}

	getPerimeterHitBoxes() {
		return [
			{
				x: this.x + this.width / 2,
				y: this.y,
				width: 2,
				height: 2
			},
			{
				x: this.x + this.width,
				y: this.y + this.height / 2,
				width: 2,
				height: 2
			},
			{
				x: this.x + this.width / 2,
				y: this.y + this.height,
				width: 2,
				height: 2
			},
			{
				x: this.x,
				y: this.y + this.height / 2,
				width: 2,
				height: 2
			}
		];
	}

	constrainPosition(maxX, maxY, minX, minY) {
		const eastPoint = this.x + this.width;
		const westPoint = this.x;
		const northPoint = this.y;
		const southPoint = this.y + this.height;
		const xChange = this.xSpeed * this.maxSpeed;
		const yChange = this.ySpeed * this.maxSpeed;

		if (eastPoint >= maxX) {
			this.x = maxX - 1;
		} else if (westPoint <= minX) {
			this.x = minX + 1;
		}

		if (southPoint >= maxY) {
			this.y = maxY - 1;
		} else if (northPoint <= minY) {
			this.y = minY + 1;
		}
	}

	getFuturePosition(x = this.x, y = this.y) {
		return {
			x: x + this.xSpeed,
			y: y + this.ySpeed
		};
	}
	turn(dir) {
		this.dir = dir;
		this.xSpeed = Math.cos(this.dir) * this.maxSpeed;
		this.ySpeed = Math.sin(this.dir) * this.maxSpeed;
		this.xSpeed *= -1;

		this.leadingHitbox = this.calculateLeadingHitbox();

	}
	applyDrag() {
		if (this.xSpeed > 0) {
			this.xSpeed -= this.drag;
		} else {
			this.xSpeed += this.drag;
		}

		if (this.ySpeed > 0) {
			this.ySpeed -= this.drag;
		} else {
			this.ySpeed += this.drag;
		}
	}
	move() {
		this.applyDrag();
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.leadingHitbox = this.calculateLeadingHitbox();
	}

	decelerateX() {
		let xChange = 0.1;

		if (this.xSpeed > 0) {
			xChange = -0.1;
		}

		if (Math.abs(this.xSpeed) < 0.3) {
			xChange = 0;
		}

		this.xSpeed += xChange;
	}
	mirrorReflect() {
		this.xSpeed *= -1;
		this.ySpeed *= -1;
	}
	bounceBack() {
		const oldDir = this.dir;
		const degrees = Utils.radToDeg(this.dir);
		const oppositeAngle = (degrees + 180) % 360;
		const radians = Utils.degToRad(oppositeAngle);

		this.turn(radians);
		this.move();
		this.turn(oldDir);
	}
	
	decelerateY() {

	}
	update() {
		if (this.isMoving) {
			this.move();
		}
		if (this.isAnimating) {
			if (this.animationDelay === 0) {
				this.animationDelay = this.MAX_ANIMATION_DELAY;
				if (this.frame < this.MAX_FRAMES) {
					this.frame++;
				} else {
					this.frame = 0;
				}
			}
			this.animationDelay--;
		}

		if (this.hasAliveTimer) {
			this.aliveTime++;
			if (this.aliveTime === this.TOTAL_ALIVE_TIME) {
				this.reset();
			}
		}
	}

	stop() {
		this.isMoving = false;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.dir = 0;
	}

	activate() {
		this.isMoving = true;
		this.isActive = true;
		this.isAnimating = true;
	}
}