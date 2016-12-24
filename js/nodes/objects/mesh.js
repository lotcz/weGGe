weggeMesh.prototype = new weggeObject();
weggeMesh.prototype.constructor = weggeMesh; 

function weggeMesh() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--mesh--";
	this.json.type = "Mesh";
	this.json.model_resource_id = 0;
}

weggeMesh.prototype.initialize = function ( resources ) {
	this.applyJSON(resources);
	return this.wrapper;
}

weggeMesh.prototype.applyJSON = function(resources) {
	if (resources) {
		var res = resources.getById( this.json.model_resource_id );	
		if (res && res.geometry && res.material) {
			if (_b(this.json.physics)) {
				var phy_material = Physijs.createMaterial(
					res.material,
					.6, // friction
					.7 // bounciness
				);
				this.wrapper = new Physijs.CapsuleMesh(res.geometry, phy_material, this.json.mass );
			} else {
				this.wrapper = new THREE.Mesh( res.geometry, res.material );	
			}
		} else {
			console.log("Model not found:" + this.json.model_resource_id);
		}
	}
	this.applyBasic();
}

weggeMesh.prototype.getRequiredResources = function() {
	return [this.json.model_resource_id];
}

weggeNode.prototype.availableTypes.push("Mesh");

weggeAnimatedMesh.prototype = new weggeMesh();
weggeAnimatedMesh.prototype.constructor = weggeAnimatedMesh; 

function weggeAnimatedMesh() {
	this.base = weggeMesh;
	this.base();
	
	this.json.name = "animated_mesh_";
	this.json.type = "AnimatedMesh";
	this.json.model_resource_id = 0;
	this.json.duration = 2;
	this.json.time = 0;
}

weggeAnimatedMesh.prototype.initialize = function ( resources ) {
	this.applyJSON(resources);
	return this.wrapper;
}

weggeAnimatedMesh.prototype.applyJSON = function(resources) {	
	if (resources) {
		var res = resources.getById( this.json.model_resource_id );
		if (res && res.geometry && res.material) {
			var material = new THREE.MeshPhongMaterial( {
				color: 0xffffff,
				morphTargets: true,
				vertexColors: THREE.FaceColors,
				shading: THREE.FlatShading
			} );
			this.wrapper = new THREE.Mesh( res.geometry, material );
			this.mixer = new THREE.AnimationMixer( this.wrapper );
			this.mixer.clipAction( res.geometry.animations[ 0 ] ).setDuration( this.json.duration ).play();					
		} else {
			console.log("Model not initialized:" + this.json.model_resource_id);
		}
	}

	this.applyBasic();
}

weggeAnimatedMesh.prototype.animationFrame = function (delta) {
	if (this.mixer) {
		this.mixer.update(delta);
	}
}

weggeNode.prototype.availableTypes.push("AnimatedMesh");