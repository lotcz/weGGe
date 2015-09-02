weggeSound.prototype = new weggeResource();
weggeSound.prototype.constructor = weggeSound;    
weggeSound.prototype.context = new AudioContext();

function weggeSound() {
	weggeResource.call(this);
	this.initialized = false;
	this.json.type = "Sound";
	this.json.name = "sound";
	this.json.color = "#FFFFFF";
	this.json.path = "";
}

weggeSound.prototype.initialize = function ( onInitialized ) {	
	this.onInitialized = onInitialized;
	
	var request = new XMLHttpRequest();
	request.open("GET", this.json.path, true);
	request.responseType = "arraybuffer";
	var _loader = this;

	request.onload = function() {
		_loader.context.decodeAudioData(
			request.response,
			function(buffer) {
				if (!buffer) {
					console.log('error decoding file data: ' + url);
					return;
				}
				_loader.buffer = buffer;
				_loader.initialized = true;
				_loader.onInitialized();
			},
			function(error) {
				console.log('decodeAudioData error ' + error);
			}
		);
	}

	request.onerror = function() {
		console.log('BufferLoader: XHR error');
	}

	request.send();
		
}

weggeResource.prototype.availableTypes.push("Sound");