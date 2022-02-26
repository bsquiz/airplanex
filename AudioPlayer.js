class AudioPlayer {
	constructor() {
		this.loader = new ResourceLoader(
			['explosion', 'shot', 'coin'],
			'audio',
			'audio',
			'm4a'
			);
		this.Sound = {
			EXPLOSION: 'explosion',
			SHOT: 'shot',
			COIN: 'coin'
		};
	}

	init() {
		this.loader.loadFiles();
	}

	play(sound) {
		this.loader.files.get(sound).play();
	}
}