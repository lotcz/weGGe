weggeMaterial.prototype = new weggeResource();
weggeMaterial.prototype.constructor = weggeMaterial; 

function weggeMaterial() {	
	weggeResource.call(this);	
	this.initialized = false;
	
	this.json.type = "Material";
	this.json.name = "--texture--";
	this.json.material_type = "MeshLambertMaterial";	
	this.json.color = "#D0D0D0";
	this.material = false;
}

weggeMaterial.prototype.initialize = function ( onInitialized ) {	
	if (false) {};
	this.material = new THREE[this.json.material_type]( { color: this.json.color, side: THREE.DoubleSide } );										
	this.initialized = true;
	onInitialized();
}

weggeMaterial.prototype.renderPreview = function ( ) {
	return false; //$("<img></img>").attr("src",this.json.path).css({maxHeight:"480px",maxWidth:"640px"});
}	

weggeResource.prototype.availableTypes.push("Material");