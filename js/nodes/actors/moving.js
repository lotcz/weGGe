weggeMovingActor.prototype = new weggeActor();
weggeMovingActor.prototype.constructor = weggeMovingActor; 

function weggeMovingActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "MovingActor";
	this.json.name = "--Moving actor--";	
	this.json.move_amount = 100;
	
}

weggeMovingActor.prototype.moveForward = function(args) {
	if (this.target !== null && this.target.wrapper) {
		this.target.wrapper.translateZ( parseFloat(this.json.move_amount) );
	}
}

weggeMovingActor.prototype.moveBackward = function(args) {
	if (this.target !== null && this.target.wrapper) {
		this.target.wrapper.translateZ( -parseFloat(this.json.move_amount) );
	}
}

weggeNode.prototype.availableTypes.push("MovingActor");