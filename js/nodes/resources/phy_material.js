weggePhysicsMaterial.prototype = new weggeMaterial();
weggePhysicsMaterial.prototype.constructor = weggePhysicsMaterial; 

function weggePhysicsMaterial() {	
	weggeMaterial.call(this);	
	
	this.json.type = "PhysicsMaterial";
	this.json.name = "--physics-material--";
	this.json.friction = 1;
	this.json.bounciness = 1;
	this.material = false;
}

weggePhysicsMaterial.prototype.initialize = function ( onInitialized ) {
	var material = new THREE[this.json.material_type]( { color: this.json.color, side: THREE.DoubleSide } );
	this.material = Physijs.createMaterial(	material, parseFloat(this.json.friction), parseFloat(this.json.bounciness));
	this.initialized = true;
	onInitialized();
}

weggePhysicsMaterial.prototype.renderPreview = function ( ) {
	return false;
}	

weggeResource.prototype.availableTypes.push("PhysicsMaterial");