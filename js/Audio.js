class AudioPlayer {
	constructor() {
		this.loader = new ResourceLoader(
			['explosion'],
			'audio',
			'audio',
			'm4a'
			);
	}

	init() {
		this.loader.loadFiles();
	}
}