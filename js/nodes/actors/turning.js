weggeTurningActor.prototype = new weggeActor();
weggeTurningActor.prototype.constructor = weggeTurningActor; 

function weggeTurningActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "TurningActor";
	this.json.name = "--turning actor--";	
	this.json.turn_angle = Math.PI/10;
	
}

weggeTurningActor.prototype.turn = function( v ) {
	if (this.target !== null && this.target.wrapper) {
		this.target.wrapper.rotateOnAxis( v, this.json.turn_angle );
	}
}

weggeTurningActor.prototype.turnLeft = function(args) {
	this.turn(_v(0,1,0));
}

weggeTurningActor.prototype.turnRight = function(args) {
	this.turn(_v(0,-1,0));
}

weggeTurningActor.prototype.turnUp = function(args) {
	this.turn(_v(1,0,0));
}

weggeTurningActor.prototype.turnDown = function(args) {
	this.turn(_v(-1,0,0));
}

weggeNode.prototype.availableTypes.push("TurningActor");