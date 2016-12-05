weggeCruisingActor.prototype = new weggeActor();
weggeCruisingActor.prototype.constructor = weggeCruisingActor; 

function weggeCruisingActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "CruisingActor";
	this.json.name = "cruising_actor";	
	this.json.default_speed = 500;
	this.json.turnTarget = false;
	this.json.enabled = true;
	
	this.initialized = false;	
	this.next_target = false;
	this.step = false;
	this.distance_left = 0;
}

weggeCruisingActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.findNodeByName(this.json.target_name);
	}	
	if (this.target) {
		this.mesh = this.target.wrapper;
	}
	if (this.children.length > 1) {
		for (var i = 1,max = this.children.length; i<max; i++) {
			if (_b(this.children[i].json.chain)) {
				this.children[i-1].neighbours.push(this.children[i]);
			}
			if (_b(this.children[i].json.close_circle)) {				
				this.children[i].neighbours.push(this.children[0]);
			}
		}
	}
	if (this.children.length > 0) {
		this.setCruisingTarget(this.children[0]);
	}
}

weggeCruisingActor.prototype.restart = function( ) {
	if (this.children.length > 0) {
		this.setCruisingTarget(this.children[0]);
		this.json.enabled = true;
	}	
}

weggeCruisingActor.prototype.findNextTarget = function( ) {		
	this.next_target = this.next_target.neighbours[ Math.floor( Math.random() * (this.next_target.neighbours.length) ) ];
	if (this.next_target) {		
		if (parseInt(this.next_target.json.speed) == 0) {
			this.setCruisingTarget(this.next_target);
		} else {
			this.distance_left = this.mesh.position.distanceTo(this.next_target.vector);
			this.step = this.next_target.initStep( this.mesh.position, this.json.default_speed );
			this.distance_last_check = 0;	
			if (this.json.turnTarget) {
				this.mesh.lookAt( this.next_target.vector );
			}
		}
	} else {
		this.json.enabled = false;
	}
}

weggeCruisingActor.prototype.setCruisingTarget = function( target ) {
	if (this.mesh && target.vector) {
		this.mesh.position.copy( target.vector );
		this.next_target = target;
		this.findNextTarget();	
	}
}

weggeCruisingActor.prototype.animationFrame = function( delta ) {	
	if (_b(this.json.enabled) && this.mesh) {			
		/* move mesh */
		var step = new THREE.Vector3();	
		step.copy( this.step );
		step.multiplyScalar( delta );
		step.setLength( Math.min(this.distance_left,step.length()) );
		this.distance_left -= step.length();
		this.mesh.position.add( step );
		
		if ( this.distance_left <= 0 ) {
			this.findNextTarget();			
		}
	}
}

weggeNode.prototype.availableTypes.push("CruisingActor");

weggeCruisingTarget.prototype = new weggePoint();
weggeCruisingTarget.prototype.constructor = weggeCruisingTarget; 

function weggeCruisingTarget() {
	this.base = weggePoint;
	this.base();	
	
	this.json.type = "CruisingTarget";
	this.json.name = "cruising_target";	
	this.json.speed = "";	
	this.json.chain = 1;	
	this.json.close_circle = 0;	
	this.neighbours = new Array();
}

weggeCruisingTarget.prototype.initStep = function( position, defaultSpeed ) {
	var step = new THREE.Vector3();
	step.subVectors( this.vector, position );
	step.setLength( parseFloat(_coalesce(_nul(this.json.speed),defaultSpeed)) );
	return step;
}

weggeCruisingTarget.prototype.initialize = function ( resources ) {
	var wrapper;
	if (WEGGE_CREATOR_MODE) {
		this.wrapper = new THREE.Object3D();
		this.applyBasic();
		wrapper = this.wrapper;
	} else {
		wrapper = [];		
	}
	this.vector = _arrayToVector(this.json.position);
	return wrapper;
}

weggeNode.prototype.availableTypes.push("CruisingTarget");