class AudioPlayer {
	constructor() {
		this.loader = new ResourceLoader(
			['explosion', 'shot', 'coin', 'upgrade', 'bgm'],
			'audio',
			'audio',
			'm4a'
			);
		this.Sound = {
			EXPLOSION: 'explosion',
			SHOT: 'shot',
			COIN: 'coin',
			UPGRADE: 'upgrade',
			BGM: 'bgm'
		};
	}

	init() {
		this.loader.loadFiles();
	}
	setVolume(sound, volume) {
		this.loader.files.get(sound).volume = volume;
	}
	loopSound(sound) {
		this.loader.files.get(sound).loop = true;
	}

	play(sound) {
		this.loader.files.get(sound).play();
	}

	pause(sound) {
		this.loader.files.get(sound).pause();
	}
	playBGM() {
		this.loopSound(this.Sound.BGM);
		this.setVolume(this.Sound.BGM, 0.5);
		this.play(this.Sound.BGM);
	}
}