class Background {
	constructor() {
		this.islands = [

			new Island(-50, 50 - Utils.HEIGHT, 3),
			new Island(50, 100 - Utils.HEIGHT, 2),
			new Island(150, 150 - Utils.HEIGHT, 1),
			new Island(-50, 300 - Utils.HEIGHT, 3),
			new Island(0, 500 - Utils.HEIGHT, 2),

			new Island(-50, 100, 3),
			new Island(50, 150, 2),
			new Island(150, 200, 1),
			new Island(250, 400, 3),
			new Island(50, 500, 2)
		];
	}

	update() {
		this.islands.forEach(island => {
			island.update();

			if (island.y > Utils.HEIGHT * 1.5) {
				island.y = (Utils.HEIGHT) * -1;
			}
		});
	}
}