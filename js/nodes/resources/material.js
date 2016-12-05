weggeMaterial.prototype = new weggeResource();
weggeMaterial.prototype.constructor = weggeMaterial; 

function weggeMaterial() {	
	weggeResource.call(this);	
	this.initialized = false;
	
	this.json.type = "Material";
	this.json.name = "--texture--";
	this.json.material_type = "MeshBasicMaterial";	
	this.json.color = "#D0D0D0";
	this.json.wireframe = false;
	this.material = false;
}

weggeMaterial.prototype.initialize = function ( onInitialized ) {	
	this.material = new THREE[this.json.material_type]( { color: this.json.color, side: THREE.DoubleSide, wireframe:_b(this.json.wireframe) } );										
	this.initialized = true;
	onInitialized();
}

weggeMaterial.prototype.renderPreview = function ( ) {
	return false;
}	

weggeResource.prototype.availableTypes.push("Material");

weggeInvisibleMaterial.prototype = new weggeMaterial();
weggeInvisibleMaterial.prototype.constructor = weggeInvisibleMaterial;    

function weggeInvisibleMaterial() {
	weggeMaterial.call(this);
	this.initialized = false;
	this.json.type = "invisible_material";
	this.json.name = "--InvisibleMaterial--";
	this.json.color = "#FFFFFF";
	this.json.wireframe = true;
}

weggeInvisibleMaterial.prototype.initialize = function ( onInitialized ) {	
	if (WEGGE_CREATOR_MODE) {
		this.material = new THREE[this.json.material_type]( { color: this.json.color, side: THREE.DoubleSide,wireframe:_b(this.json.wireframe) } );
	} else {
		this.material = new THREE[this.json.material_type]( { side: THREE.OneSide,wireframe:false,opacity:0,transparent:true } );
	}
	this.initialized = true;
	onInitialized();
}

weggeInvisibleMaterial.prototype.renderPreview = function ( ) {
	return false;
}

weggeResource.prototype.availableTypes.push("InvisibleMaterial");