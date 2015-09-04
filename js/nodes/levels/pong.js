weggePongLevel.prototype = new weggeLevel();
weggePongLevel.prototype.constructor = weggePongLevel; 

function weggePongLevel() {
	this.base = weggeLevel;
	this.base();	
	
	this.json.type = "PongLevel";
	this.json.name = "";	
	
	this.tail_time = 0;
	this.tail_speed = 0;
}

/* MILESTONES */

weggePongLevel.prototype.startGame = function() {	
	this.rh_hasCube = true;	
	this.cube_actor.target.wrapper.position.copy(this.right_hand.wrapper.position);
	this.cube_actor.target.wrapper.position.z -= 10;
	this.cube_actor.target.wrapper.__dirtyPosition = true;
	this.cube_actor.target.wrapper.rotation.set(0,0,0);
	this.cube_actor.target.wrapper.__dirtyRotation = true;		
	this.cube_vert = 0;	
}

weggePongLevel.prototype.gameOver = function() {
	this.cube_actor.stopMovement();
	this.tail_speed = 0;
	this.bing_audio.play();
	this.startGame();
}

weggePongLevel.prototype.cubeSpeedAccelerated = function() {				
	this.tail_speed = 35;
	if (this.tail_time > (1/this.tail_speed)) {
		this.tail_time = 0; //create dynamic cube now
	}
}

weggePongLevel.prototype.pushLeft = function(args) {			
	this.cube_actor.pushZ(-_coalesce(args,250));
	//this.cubeSpeedAccelerated();
}

weggePongLevel.prototype.pushRight = function(args) {			
	this.cube_actor.pushZ(_coalesce(args,250));
	//this.cubeSpeedAccelerated();
}

weggePongLevel.prototype.pushUp = function(args) {			
	this.cube_actor.pushY(_coalesce(args,150));
	//this.cubeSpeedAccelerated();
}

weggePongLevel.prototype.pushDown = function(args) {			
	this.cube_actor.pushY(-_coalesce(args,150));
	//this.cubeSpeedAccelerated();
}

weggePongLevel.prototype.onKeyDown = function(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	//console.log("key:" + key);
	switch( key ) {
		case 87: /* W */
			this.rightHandUp();
			break;				
		case 83: /* S */
			this.rightHandDown();
			break;
		case 65: /* A */
			//pushLeft();
			break;
		case 68: /* D */
			//pushRight();
			break;	
		case 32: /* space */
			this.shoot();
			break;					
	}
}

weggePongLevel.prototype.onKeyUp = function(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	//console.log("key:" + key);
	switch( key ) {
		case 87: /* W */
			this.stopRightHand()
			break;				
		case 83: /* S */
			this.stopRightHand()
			break;
		case 37: /* left */
			this.pushLeft();
			break;
		case 39: /* right */
			this.pushRight();
			break;				
	}
}

weggePongLevel.prototype.stopRightHand = function() {
	this.rh_moving = false;
}

weggePongLevel.prototype.rightHandUp = function() {
	this.rh_moving = true;
	this.rh_up = true;
}

weggePongLevel.prototype.rightHandDown = function() {
	this.rh_moving = true;
	this.rh_up = false;
}

weggePongLevel.prototype.onMouseMove = function(event) {
	if (this.mouseY > event.pageY) {
		this.rightHandUp();
	} else if (this.mouseY < event.pageY) {
		this.rightHandDown();
	}
	this.mouseX = event.pageX;
	this.mouseY = event.pageY;
}

weggePongLevel.prototype.shoot = function() {
	this.pushLeft(350);
	this.rh_hasCube = false;
	this.spring_audio.play();
	if (this.rh_moving) {
		if (this.rh_up) {
			this.cube_vert = 1;
			this.pushUp();
		} else {
			this.cube_vert = -1;
			this.pushDown();
		}
	}			
}

weggePongLevel.prototype.animationFrame = function(delta) {
	
	for ( var i = 0, max = this.animated.length; i < max; i++) {
		this.animated[i].animationFrame(delta);
	}
	
	if (this.rh_moving) {
		if (this.rh_up) {
			this.right_hand.wrapper.position.y = Math.min(this.right_hand.wrapper.position.y + 10, 180);					
		} else {
			this.right_hand.wrapper.position.y = Math.max(this.right_hand.wrapper.position.y - 10, -180);;
		}
		this.right_hand.wrapper.__dirtyPosition = true;
		if (this.rh_hasCube) {
			this.cube_actor.target.wrapper.position.copy(this.right_hand.wrapper.position);
			this.cube_actor.target.wrapper.position.z -= 10;
			this.cube_actor.target.wrapper.__dirtyPosition = true;
			this.cube_actor.stopMovement();					
		}				
	}
	this.tail_time -= delta;
	if (!this.rh_hasCube && (this.tail_speed > 3) && (this.tail_time <= 0)) {
		this.cube_dynamic.create(this.cube_actor.target.wrapper.position,1);
		this.tail_time = 1/this.tail_speed;
		this.tail_speed -= (this.tail_speed*0.2);
	}
}
weggePongLevel.prototype.cubeBlast = function() {
	this.blasts.create(this.cube_actor.target.wrapper.position,2.5);
}

weggePongLevel.prototype.cubeHit = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	
	if (this.initialized) {
		
		if (other_object === this.left_hand.wrapper) {
			if (this.lh_moving) {
				if (this.lh_up) {
					this.cube_vert = 1;
					this.pushUp();
				} else {
					this.cube_vert = -1;
					this.pushDown();
				}
			}
			this.pop_audio.play();			
			this.rh_shot = false;
		} else if (other_object === this.right_hand.wrapper) {
			if (this.rh_moving) {
				if (this.rh_up) {
					this.cube_vert = 1;
					this.pushUp(250);
				} else {
					this.cube_vert = -1;
					this.pushDown(250);
				}
			}
			if (!this.rh_hasCube) {
				this.pop_audio.play();
			}
			this.rh_shot = true;
		} else if (other_object === this.wall_up.wrapper) {
			if (this.rh_shot) {						
				this.pushLeft();
			} else {
				this.pushRight();
			}
			//this.pop_audio.play();
			this.cubeSpeedAccelerated();
			this.cubeBlast();
			this.cube_vert = -1;
		} else if (other_object === this.wall_down.wrapper) {
			if (this.rh_shot) {						
				this.pushLeft();
			} else {
				this.pushRight();						
			}
			//this.pop_audio.play();
			this.cubeSpeedAccelerated();
			this.cubeBlast();
			this.cube_vert = 1;
		}
	}			
}

weggePongLevel.prototype.wall_left_hit = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	this.right_hand.score += 100;
	this.updateScore(this.right_hand);
	this.gameOver();		
}

weggePongLevel.prototype.wall_right_hit = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	this.left_hand.score += 100;
	this.updateScore(this.left_hand);
	this.gameOver();		
}
	
weggePongLevel.prototype.initialize = function ( host3D, resources ) {
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
	
	this.pop_audio = this.findNodeByName("pop_audio_actor");
	this.spring_audio = this.findNodeByName("spring_audio_actor");
	this.bing_audio = this.findNodeByName("bing_audio_actor");
	
	this.cube_actor = this.findNodeByName("cube_actor");
	this.cube_actor.target.wrapper.setAngularFactor(_v(0,0,0));
	this.cube_actor.target.wrapper.setLinearFactor(_v(0,1,1));
	this.cube_actor.target.wrapper.setCcdMotionThreshold(13.5);// Enable CCD if the object moves more than 1 meter in one simulation frame
	this.cube_actor.target.wrapper.setCcdSweptSphereRadius(1);// Set the radius of the embedded sphere such that it is smaller than the object
	this.cube_actor.target.wrapper.addEventListener( 'collision', _bind(this, this.cubeHit) );
	
	this.cube_dynamic = this.findNodeByName("cube_dynamic");
	this.blasts = this.findNodeByName("dynamic_blasts");
			
	this.wall_left = this.findNodeByName("wall_left");
	this.wall_left.wrapper.addEventListener( 'collision', _bind(this, this.wall_left_hit));
	
	this.wall_right = this.findNodeByName("wall_right");
	this.wall_right.wrapper.addEventListener( 'collision', _bind(this, this.wall_right_hit));
	
	this.wall_up = this.findNodeByName("wall_up");
	this.wall_down = this.findNodeByName("wall_down");
				
	this.ui = new weggeUI();
	
	this.left_hand = this.findNodeByName("left_hand");
	this.left_hand.wrapper.setLinearFactor(_v(0,1,0));
	this.left_hand.wrapper.setAngularFactor(_v(0,0,0));
	this.left_hand.player_name = "Player 1";
	this.left_hand.score = 0;	
	this.left_hand.ui = this.createScoreUI(this.left_hand, {left:"20px"});
	
	this.right_hand = this.findNodeByName("right_hand");
	this.right_hand.wrapper.setLinearFactor(_v(0,1,0));
	this.right_hand.wrapper.setAngularFactor(_v(0,0,0));
	this.right_hand.player_name = "Player 2";
	this.right_hand.score = 0;
	this.right_hand.ui = this.createScoreUI(this.right_hand, {right:"20px"});
	
	window.document.addEventListener( 'keyup', _bind(this, this.onKeyUp) );
	window.document.addEventListener( 'keydown', _bind(this, this.onKeyDown) );

	this.initialized = true;
	this.startGame();
}

/* UI */

weggePongLevel.prototype.createScoreUI = function(hand, css) {
	var score = this.ui.addContainer().css(css).css({position:"absolute",top:"20px",margin:"15px",padding:"15px",border:"solid 1px White"});	
	this.ui.addContainer(score).append(hand.player_name);
	return this.ui.addContainer(score)
		.css({fontFamily:"fantasy",fontSize:"22pt"})
		.append(hand.score);
}

weggePongLevel.prototype.updateScore = function(hand) {	
	var s = parseFloat(hand.score).toLocaleString();
	hand.ui.html(s);
}