weggePlane.prototype = new weggeObject();
weggePlane.prototype.constructor = weggePlane; 

function weggePlane() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--plane--";
	this.json.type = "Plane";
	this.json.material_id = 0;
}

weggePlane.prototype.initialize = function ( resources ) {
	var geometry, material;
	
	var geometry = new THREE.PlaneGeometry(10, 10, 10);
	
	var res = resources.getById( this.json.material_id );
	if (res) {
		material = res.material;
	} else {
		material = new THREE.MeshLambertMaterial();
	}
	
	if (this.json.physics) {
		var phy_material = Physijs.createMaterial(
			material,
			.6, // medium friction
			.3 // low restitution
		);		
		this.wrapper = new Physijs.PlaneMesh(
			geometry,
			phy_material,
			this.json.mass
		);	
	} else {		
		this.wrapper = new THREE.Mesh( geometry, material );
	}
		
	this.applyBasic();
	return this.wrapper;
	
}

weggePlane.prototype.getRequiredResources = function() {
	var required = [];
	required.push(this.json.material_id);
	return required;
}

weggeNode.prototype.availableTypes.push("Plane");