weggeResource.prototype = new weggeNode();
weggeResource.prototype.constructor = weggeResource; 

function weggeResource() {	
	weggeNode.call(this);	
}

weggeResource.prototype.loadFromJSON = function ( id, json ) {
	this.json = json;
	this.id = id;
}

weggeResource.prototype.initialize = function ( onInit ) {
	this.initialized = true;
	onInit();
}

weggeResource.prototype.availableTypes = [];

weggeMaterial.prototype = new weggeResource();
weggeMaterial.prototype.constructor = weggeMaterial; 

function weggeMaterial() {	
	weggeResource.call(this);	
	
	this.json.resource_type = "Material";
	this.material = false;
}

weggeGeometry.prototype = new weggeResource();
weggeGeometry.prototype.constructor = weggeGeometry; 

function weggeGeometry() {	
	weggeResource.call(this);	
	
	this.json.resource_type = "Geometry";
	this.geometry = false;
}