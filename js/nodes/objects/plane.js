weggePlane.prototype = new weggeObject();
weggePlane.prototype.constructor = weggeObject; 

function weggePlane() {

}

weggePlane.prototype.initialize = function ( resources ) {
	var res = resources.getById( this.json.material_id );
	var geometry = new THREE.PlaneGeometry(100, 100, 100);
	this.wrapper = new THREE.Mesh( geometry, res.material );
	if (this.json.position) {
		this.wrapper.position.set(this.json.position.x, this.json.position.y, this.json.position.z);
	}
	//this.wrapper.rotation.y = Math.PI/2;
	this.wrapper.scale.set(50, 50, 50);
	return this.wrapper;
}

weggePlane.prototype.getRequiredResources = function() {
	var required = [];
	required.push(this.json.material_id);
	return required;
}