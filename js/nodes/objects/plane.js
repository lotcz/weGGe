weggePlane.prototype = new weggeObject();
weggePlane.prototype.constructor = weggePlane; 

function weggePlane() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--plane--";
	this.json.type = "Plane";
	this.json.color = "#1010E0";
	this.json.material_resource_id = 0;
}

weggePlane.prototype.initialize = function ( resources ) {
	var geometry, material;
	
	var geometry = new THREE.PlaneGeometry(10, 10, 10);
	
	var res = resources.getById( this.json.material_resource_id );
	if (res && res.material) {
		material = res.material;
	} else {
		var color = new THREE.Color();
		color.setStyle(this.json.color);
		material = new THREE.MeshLambertMaterial({color:color});
	}
	
	if (this.json.physics) {
		var phy_material = Physijs.createMaterial(
			material,
			15, // friction
			0.7 // restitution
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
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Plane");