weggeResource.prototype = new weggeNode();
weggeResource.prototype.constructor = weggeResource; 

function weggeResource() {	
	weggeNode.call(this);	
}

weggeResource.prototype.loadFromJSON = function ( id, json ) {
	this.json = json;
	this.id = id;
}