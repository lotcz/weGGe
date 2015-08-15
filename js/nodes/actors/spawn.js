weggeSpawnActor.prototype = new weggeActor();
weggeSpawnActor.prototype.constructor = weggeSpawnActor; 

function weggeSpawnActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "SpawnActor";
	this.json.name = "spawn_actor_";	
	this.json.crosshair_name = "target";
	this.crosshair = null;
}

weggeSpawnActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.findNodeByName(this.json.target_name);
	}
	if (this.json.crosshair_name.length > 0) {
		this.crosshair = level.findNodeByName(this.json.crosshair_name);
	}
}

weggeSpawnActor.prototype.spawn = function(args) {
	if (this.target !== null && this.target.wrapper) {
		var ball = new weggeSphere();						
		ball.json.color = _randomColorHex();
		ball.json.scale = [1,1,1];
		ball.json.radius = 50;
		ball.json.mass = 2;
				
		var _vector = _v(0,0,0);
		var wp = this.target.wrapper.localToWorld ( _v(0,0,0) );
		var cp = this.crosshair.wrapper.localToWorld ( _v(0,0,0) );
		
		_vector.copy(cp);
		_vector.sub(wp);
		_vector.multiplyScalar(10);
		var wrapper = ball.initialize();
		wrapper.position.copy(wp);
		wrapper.__dirtyPosition = true;
		this.target.wrapper.parent.parent.parent.add(wrapper);
		wrapper.applyCentralImpulse(_vector);
	}
}

weggeNode.prototype.availableTypes.push("SpawnActor");