weggePlane.prototype = new weggeObject();
weggePlane.prototype.constructor = weggePlane; 

function weggePlane() {
	this.base = weggeObject;
	this.base();
	
	this.json.type = "Plane";
	this.json.position = {x:0,y:0,z:0};
	this.json.rotation = {x:0,y:0,z:0};
	this.json.scale = {x:0,y:0,z:0};
}

weggePlane.prototype.initialize = function ( resources ) {
	var res = resources.getById( this.json.material_id );
	var geometry = new THREE.PlaneGeometry(this.json.scale.x, this.json.scale.y, this.json.scale.z);
	this.wrapper = new THREE.Mesh( geometry, res.material );
	this.wrapper.position.set(this.json.position.x, this.json.position.y, this.json.position.z);
	this.wrapper.rotation.set(this.json.rotation.x, this.json.rotation.y, this.json.rotation.z);
	return this.wrapper;
}

weggePlane.prototype.getRequiredResources = function() {
	var required = [];
	required.push(this.json.material_id);
	return required;
}