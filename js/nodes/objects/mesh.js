weggeMesh.prototype = new weggeObject();
weggeMesh.prototype.constructor = weggeMesh; 

function weggeMesh() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--mesh--";
	this.json.type = "Mesh";
	this.json.model_id = 0;
}

weggeMesh.prototype.initialize = function ( resources ) {
	this.applyJSON(resources);
	return this.wrapper;
}

weggeMesh.prototype.applyJSON = function(resources) {
	if (resources) {
		var res = resources.getById( this.json.model_id );	
		if (res) {
			this.wrapper = new THREE.Mesh( res.geometry, res.material );	
		} else {
			console.log("Model not found:" + this.json.model_id);
		}
	}
	this.applyBasic();
}

weggeMesh.prototype.getRequiredResources = function() {
	var required = [this.json.model_id];
	return required;
}

weggeNode.prototype.availableTypes.push("Mesh");

weggeAnimatedMesh.prototype = new weggeMesh();
weggeAnimatedMesh.prototype.constructor = weggeAnimatedMesh; 

function weggeAnimatedMesh() {
	this.base = weggeMesh;
	this.base();
	
	this.json.name = "--animated-mesh--";
	this.json.type = "AnimatedMesh";
	this.json.model_id = 0;
	this.json.duration = 2;
	this.json.time = 0;
}

weggeAnimatedMesh.prototype.initialize = function ( resources ) {
	this.applyJSON(resources);
	return this.wrapper;
}

weggeAnimatedMesh.prototype.applyJSON = function(resources) {	
	if (resources) {
		var res = resources.getById( this.json.model_id );
		if (res) {
			this.wrapper = new THREE.MorphAnimMesh( res.geometry, res.material );
		}
	}
	if (this.wrapper) {
		this.wrapper.duration = _coalesce(this.json.duration, 2);
		this.wrapper.time = _coalesce(this.json.time, 0);
	}
	this.applyBasic();
}

weggeAnimatedMesh.prototype.animationFrame = function (delta) {
	if (this.wrapper && this.wrapper.updateAnimation) {
		this.wrapper.updateAnimation(delta);
	}
}

weggeNode.prototype.availableTypes.push("AnimatedMesh");