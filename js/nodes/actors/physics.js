weggePhysicsActor.prototype = new weggeActor();
weggePhysicsActor.prototype.constructor = weggePhysicsActor; 

function weggePhysicsActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "PhysicsActor";
	this.json.name = "--Physics actor--";	
	this.json.push_amount = 5;
}

weggePhysicsActor.prototype.applyCentralImpulse = function(v) {
	this.target.wrapper.applyCentralImpulse(v);
}

weggePhysicsActor.prototype.pushX = function(args) {
	if (this.target !== null && this.target.wrapper) {	
		this.applyCentralImpulse( _v(parseFloat(args,this.json.push_amount,10),0,0) );
	}
}

weggePhysicsActor.prototype.pushY = function(args) {
	if (this.target !== null && this.target.wrapper) {	
		this.applyCentralImpulse( _v(0,parseFloat(args,this.json.push_amount,10),0) );
	}
}

weggePhysicsActor.prototype.pushZ = function(args) {
	if (this.target !== null && this.target.wrapper) {	
		this.applyCentralImpulse( _v(0,0,parseFloat(args,this.json.push_amount,10)) );
	}
}
weggePhysicsActor.prototype.zeroV = _v(0,0,0);

weggePhysicsActor.prototype.stopMovement = function(args) {
	if (this.target !== null && this.target.wrapper) {	
		this.target.wrapper.setLinearVelocity(this.zeroV);
		this.target.wrapper.setAngularVelocity(this.zeroV);		
	}
}
				
weggeNode.prototype.availableTypes.push("PhysicsActor");