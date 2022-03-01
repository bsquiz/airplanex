class ResourceLoader {
	constructor(fileNames, type, path, fileExtension) {
		this.fileNames = fileNames;
		this.fileExtension = fileExtension;
		this.type = type;
		this.path = path;
		this.files = new Map();
		this.filesLoaded = 0;
		this.filesToLoad = this.fileNames.length;

	}
	loadFiles() {
		this.fileNames.forEach(fileName => {
			let file;
			let event;

			if (this.type === 'image') {
				file = new Image();
				event = 'load';
			} else {
				file = new Audio();
				event = 'canplaythrough';
			}

			file.addEventListener(event, (e) => { this.fileLoaded()});
			file.src = `${this.path}/${fileName}.${this.fileExtension}`;
			this.files.set(fileName, file);
		});
	}
	fileLoaded() {
		this.filesLoaded++;
		if (this.filesLoaded === this.filesToLoad) {
			const eventName = `filesloaded-${this.type}`;
			const event = new Event(eventName);
			document.dispatchEvent(event);
		}
	}
}