weggeResource.prototype = new weggeNode();
weggeResource.prototype.constructor = weggeResource; 

function weggeResource() {	
	weggeNode.call(this);
	this.initialized = false;
}

weggeResource.prototype.initialize = function ( onInit ) {
	this.initialized = true;
	onInit();
}

weggeResource.prototype.renderPreview = function ( ) {
	return false;
}

weggeResource.prototype.availableTypes = [];