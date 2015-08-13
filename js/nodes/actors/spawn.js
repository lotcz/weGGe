weggeSpawnActor.prototype = new weggeActor();
weggeSpawnActor.prototype.constructor = weggeSpawnActor; 

function weggeSpawnActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "SpawnActor";
	this.json.name = "spawn_actor_";	
	
	
}

weggeSpawnActor.prototype.spawn = function(args) {
	if (this.target !== null && this.target.wrapper) {
		var ball = new weggeSphere();						
		ball.json.color = _randomColorHex();
		ball.json.scale = [1,1,1];
		ball.json.radius = 50;
		ball.json.mass = 2;
		var wrapper = ball.initialize();
		wrapper.position.copy(this.target.wrapper.position);
		wrapper.__dirtyPosition = true;
		this.target.wrapper.parent.add(wrapper);
		
		var _vector = _v(1,1,0);
		_vector.multiplyScalar(3000);
		//_vector.copy( this.target.wrapper.rotation ).multiplyScalar(1000);
		
		wrapper.applyCentralImpulse(_vector);						
	}
}

weggeNode.prototype.availableTypes.push("SpawnActor");