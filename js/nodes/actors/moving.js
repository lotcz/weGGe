weggeMovingActor.prototype = new weggeActor();
weggeMovingActor.prototype.constructor = weggeMovingActor; 

function weggeMovingActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "MovingActor";
	this.json.name = "moving_actor";	
	this.json.move_amount = 100;
	this.json.turn_angle = Math.PI/10;
}

weggeMovingActor.prototype.moveForward = function(args) {
	if (this.target !== null && this.target.wrapper) {
		var amount;
		if (_isNumeric(args)) amount = parseFloat(args);
			this.target.wrapper.translateZ( parseFloat(_coalesce(amount,this.json.move_amount)) );
	}
}

weggeMovingActor.prototype.moveBackward = function(args) {
	if (this.target !== null && this.target.wrapper) {
		var amount;
		if (_isNumeric(args)) amount = parseFloat(args);
		this.target.wrapper.translateZ( -parseFloat(_coalesce(amount,this.json.move_amount)) );
	}
}

weggeMovingActor.prototype.turn = function( v ) {
	if (this.target !== null && this.target.wrapper) {
		this.target.wrapper.rotateOnAxis( v, this.json.turn_angle );
	}
}

weggeMovingActor.prototype.turnLeft = function(args) {
	this.turn(_v(0,1,0));
}

weggeMovingActor.prototype.turnRight = function(args) {
	this.turn(_v(0,-1,0));
}

weggeMovingActor.prototype.turnUp = function(args) {
	this.turn(_v(1,0,0));
}

weggeMovingActor.prototype.turnDown = function(args) {
	this.turn(_v(-1,0,0));
}

weggeNode.prototype.availableTypes.push("MovingActor");

weggeFollowActor.prototype = new weggeActor();
weggeFollowActor.prototype.constructor = weggeFollowActor; 

function weggeFollowActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "FollowActor";
	this.json.name = "follow_actor";	
	this.json.follower_name = "follower_id";	
}

weggeFollowActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.findNodeByName(this.json.target_name);
	}
	if (this.json.follower_name.length > 0) {
		this.follower = level.findNodeByName(this.json.follower_name);
	}
	this.json.enabled = _b(this.json.enabled && this.target && this.follower);
}

weggeFollowActor.prototype.animationFrame = function(delta) {
	if (this.json.enabled) {
		this.follower.wrapper.position.copy(this.target.wrapper.position);
	}
}

weggeNode.prototype.availableTypes.push("FollowActor");