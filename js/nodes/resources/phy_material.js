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

weggeInvisiblePhysicsMaterial.prototype = new weggePhysicsMaterial();
weggeInvisiblePhysicsMaterial.prototype.constructor = weggeInvisiblePhysicsMaterial;    

function weggeInvisiblePhysicsMaterial() {
	weggePhysicsMaterial.call(this);
	this.initialized = false;
	this.json.type = "InvisiblePhysicsMaterial";
	this.json.name = "invisible_phy_material";
	this.json.wireframe = true;
}

weggeInvisiblePhysicsMaterial.prototype.initialize = function ( onInitialized ) {	
	var material;
	if (WEGGE_CREATOR_MODE) {
		material = new THREE[this.json.material_type]( { color: this.json.color, side: THREE.DoubleSide,wireframe:_b(this.json.wireframe) } );		
	} else {
		material = new THREE[this.json.material_type]( { wireframe:false,opacity:0,transparent:true } );		
	}
	this.material = Physijs.createMaterial(	material, parseFloat(this.json.friction), parseFloat(this.json.bounciness));	
	this.initialized = true;
	onInitialized();
}

weggeInvisiblePhysicsMaterial.prototype.renderPreview = function ( ) {
	return false;
}	

weggeResource.prototype.availableTypes.push("InvisiblePhysicsMaterial");