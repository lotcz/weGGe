window.AudioContext = window.AudioContext || window.webkitAudioContext;

weggeAudioActor.prototype = new weggeActor();
weggeAudioActor.prototype.constructor = weggeAudioActor; 

function weggeAudioActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "AudioActor";
	this.json.name = "audio_actor";	
}

weggeAudioActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.resources.findNodeByName(this.json.target_name);
	}
	if (this.target) {
		this.context = this.target.context;
		this.gainNode = this.context.createGain();
		this.gainNode.connect(this.context.destination);
		this.gainNode.gain.value = 0.5;	
	}		
}

weggeAudioActor.prototype.play = function( ) {
	if (this.target) {
		this.source = this.context.createBufferSource();		
		this.source.buffer = this.target.buffer;
		this.source.connect(this.gainNode);
		this.source.start(0);
	} else {
		console.log("Sound resource not available.");
	}
}

weggeAudioActor.prototype.stop = function( ) {
	this.source.noteOff(0);
}

weggeAudioActor.prototype.getRequiredResources = function() {
	return [this.json.target_name];
}

weggeNode.prototype.availableTypes.push("AudioActor");