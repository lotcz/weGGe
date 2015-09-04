weggeCruisingActor.prototype = new weggeActor();
weggeCruisingActor.prototype.constructor = weggeCruisingActor; 

function weggeCruisingActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "CruisingActor";
	this.json.name = "cruising_actor";	
	this.json.default_speed = 10;
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

weggeCruisingActor.prototype.findNextTarget = function( ) {		
	this.next_target = this.next_target.neighbours[ Math.floor( Math.random() * (this.next_target.neighbours.length) ) ];
	if (this.next_target) {		
		if (parseInt(this.next_target.json.speed) == 0) {
			this.setCruisingTarget(this.next_target);
		} else {
			this.distance_left = this.mesh.position.distanceTo(this.next_target.vector);
			this.step = this.next_target.initStep( this.mesh.position );
			this.distance_last_check = 0;	
			this.mesh.lookAt( this.next_target.vector );
		}
	} else {
		this.json.enabled = false;
	}
}

weggeCruisingActor.prototype.setCruisingTarget = function( target ) {
	if (this.mesh) {
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
	this.json.speed = 100;	
	this.json.chain = 1;	
	this.json.close_circle = 0;	
	this.neighbours = new Array();
}

weggeCruisingTarget.prototype.initStep = function( position ) {
	var step = new THREE.Vector3();
	step.subVectors( this.vector, position );
	step.setLength( parseFloat(this.json.speed) );
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

weggeCruisingTarget.prototype.addToScene = function( n, scene ) {
	this.coordSprite = makeTextSprite( " " + this.vector.x + "," + this.vector.z + " ", 
		{ fontsize: 20, fontColor: {r:200, g:200, b:0, a:0.8},  borderColor: {r:200, g:200, b:0, a:1}, backgroundColor: {r:40, g:40, b:0, a:0.5} } );
	this.coordSprite.position.copy ( this.vector ); 
	this.coordSprite.position.y += 100;	
	
	this.nameSprite = makeTextSprite( " TiNG " + n + " ", { fontsize: 52, borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:20, g:20, b:30, a:0.5} } );
	this.nameSprite.position.copy ( this.vector );
	this.nameSprite.position.y += 300;
	
	var ch = (n % 2 == 0) ? " ~ " : " x ";
	this.arrowSprite = makeTextSprite( ch , 
		{ fontsize: 80, fontface:"Webdings", fontColor: {r:200, g:200, b:0, a:0.8},  borderColor: {r:200, g:200, b:0, a:1}, backgroundColor: {r:40, g:40, b:0, a:0.5} } );
	this.arrowSprite.position.copy ( this.vector ); 
	this.arrowSprite.position.y += 700;	
	
	scene.add( this.nameSprite );
	scene.add( this.coordSprite );		
	scene.add( this.arrowSprite );		
}	

weggeNode.prototype.availableTypes.push("CruisingTarget");
