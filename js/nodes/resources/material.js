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
	return false; //$("<img></img>").attr("src",this.json.path).css({maxHeight:"480px",maxWidth:"640px"});
}	

weggeResource.prototype.availableTypes.push("Material");