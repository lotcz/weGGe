weggePhysicsActor.prototype = new weggeActor();
weggePhysicsActor.prototype.constructor = weggePhysicsActor; 

function weggePhysicsActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "PhysicsActor";
	this.json.name = "--Physics actor--";	
	this.json.push_amount = 5;
}

/*
_vector.set( 0, 0, 0 );
selected_block.setAngularFactor( _vector );
selected_block.setAngularVelocity( _vector );
selected_block.setLinearFactor( _vector );
selected_block.setLinearVelocity( _vector );
*/
		
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

weggeNode.prototype.availableTypes.push("PhysicsActor");