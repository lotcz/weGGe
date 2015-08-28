weggeResource.prototype = new weggeNode();
weggeResource.prototype.constructor = weggeResource; 

function weggeResource() {	
	weggeNode.call(this);	
	
	this.json.id = 0;
}

weggeResource.prototype.initialize = function ( onInit ) {
	this.initialized = true;
	onInit();
}

weggeResource.prototype.availableTypes = [];

weggeGeometry.prototype = new weggeResource();
weggeGeometry.prototype.constructor = weggeGeometry; 

function weggeGeometry() {	
	weggeResource.call(this);	
	
	this.json.resource_type = "Geometry";
	this.geometry = false;
}