weggeAstronautLevel.prototype = new weggeLevel();
weggeAstronautLevel.prototype.constructor = weggeAstronautLevel; 

function weggeAstronautLevel() {
	this.base = weggeLevel;
	this.base();	
	
	this.json.type = "AstronautLevel";
	this.json.name = "";	
	
	this.tail_time = 0;
	this.tail_speed = 0;
}

/* MILESTONES */

weggeAstronautLevel.prototype.startGame = function() {	
	
}

weggeAstronautLevel.prototype.gameOver = function() {
	
}

weggeAstronautLevel.prototype.pushLeft = function(args) {			
	this.motor_1_actor.pushZ(_coalesce(args,250));
	//this.motor_1_actor.target.wrapper.applyCentralImpulse(v);
	//this.cube_actor.turnLeft();
}

weggeAstronautLevel.prototype.pushRight = function(args) {			
	this.motor_2_actor.pushZ(-_coalesce(args,250));
	//this.cube_actor.pushZ(-_coalesce(args,250));
	//this.cube_actor.turnRight();
}

weggeAstronautLevel.prototype.pushUp = function(args) {			
	//this.cube_actor.pushY(_coalesce(args,250));
	this.cube_actor.moveForward();
}

weggeAstronautLevel.prototype.pushDown = function(args) {			
	//this.cube_actor.pushY(-_coalesce(args,250));
	this.cube_actor.moveBackward();
}

weggeAstronautLevel.prototype.onKeyDown = function(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	//console.log("key:" + key);
	switch( key ) {
		case 87: /* W */
			this.pushUp();
			break;				
		case 83: /* S */
			this.pushDown();
			break;
		case 65: /* A */
			this.pushLeft();
			//this.motor_1_constraint.enableAngularMotor( 2 );
			break;
		case 68: /* D */
			this.pushRight();
			break;	
		case 32: /* space */
			this.cubeBlast();
			break;					
	}
}

weggeAstronautLevel.prototype.onKeyUp = function(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	//console.log("key:" + key);
	switch( key ) {
		case 87: /* W */
			//this.stopRightHand()
			break;				
		case 83: /* S */
			//this.stopRightHand()
			break;
		case 37: /* left */
			//this.pushLeft();
			break;
		case 39: /* right */
			//this.pushRight();
			break;				
	}
}

weggeAstronautLevel.prototype.cubeBlast = function() {
	var v = _v();
	v.copy(this.box.wrapper.position);
	v.x += 25;
	v.y -= 40;
	this.blast.create(v, 1);
}

weggeAstronautLevel.prototype.animationFrame = function(delta) {
	
	for ( var i = 0, max = this.animated.length; i < max; i++) {
		this.animated[i].animationFrame(delta);
	}
	
	this.host3D.camera.lookAt(this.box.wrapper.position);
}

weggeAstronautLevel.prototype.initialize = function ( host3D, resources ) {
	this.host3D = host3D;	
	if (this.json.physics > 0) {
		this.host3D.initScenePhysics(this.json);		
	} else {
		this.host3D.initScene(this.json);
	}	
		
	var wrappers = this.initializeChildren(resources);
	
	for (var i = 0, max = wrappers.length; i < max; i++ ) {
		this.host3D.scene.add(wrappers[i]);
	}
	
	this.applyJSON();
	this.buildAnimatedArray();
	this.resources = resources;
	this.initializeActors(this);
	
	this.box =  this.findNodeByName("box");
	this.box.wrapper.addEventListener( 'collision', _bind(this, this.cubeBlast) );
	
	this.blast = this.findNodeByName("blast");			
	this.wall_down = this.findNodeByName("plane");
	
	//this.cube_actor = this.findNodeByName("push_actor");
	//this.cube_actor.target.wrapper.setAngularFactor(_v(0,0,0));
	//this.cube_actor.target.wrapper.setLinearFactor(_v(0,1,1));
	//this.cube_actor.target.wrapper.setCcdMotionThreshold(13.5);// Enable CCD if the object moves more than 1 meter in one simulation frame
	//this.cube_actor.target.wrapper.setCcdSweptSphereRadius(1);// Set the radius of the embedded sphere such that it is smaller than the object
	
	this.motor_1_actor = this.findNodeByName("motor_1_actor");	
	this.motor_1 = this.motor_1_actor.target;	
	motor_1_constraint = new Physijs.DOFConstraint(
		this.motor_1.wrapper, this.box.wrapper, this.motor_1.wrapper.position
	);
	this.host3D.scene.addConstraint( motor_1_constraint );
	motor_1_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
	motor_1_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
	
	this.motor_2_actor = this.findNodeByName("motor_2_actor");	
	this.motor_2 = this.motor_2_actor.target;	
	motor_2_constraint = new Physijs.DOFConstraint(
		this.motor_2.wrapper, this.box.wrapper, this.motor_2.wrapper.position
	);
	this.host3D.scene.addConstraint( motor_2_constraint );
	motor_2_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
	motor_2_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
				
	this.ui = new weggeUI();
		
	window.document.addEventListener( 'keyup', _bind(this, this.onKeyUp) );
	window.document.addEventListener( 'keydown', _bind(this, this.onKeyDown) );

	this.initialized = true;
	this.startGame();
}