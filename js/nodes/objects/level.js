weggeLevel.prototype = new weggeObject();
weggeLevel.prototype.constructor = weggeObject; 

function weggeLevel() {

}

/* OVERRIDEN FROM weggeNODE */

weggeLevel.prototype.loadFromJSON = function(id, json) {
	this.id = id;
	this.json = json;	
	this.initialized = false;	
	this.loadChildrenFromJSON(json);	
	return this;
}

weggeLevel.prototype.initialize = function ( resources ) {
	this.initializeChildren(resources);
	this.initialized = true;
	return this.wrapper;
}

weggeLevel.prototype.getJSON = function() {
	/* perform updates to this.json */

	/**/
	
	this.json.children = this.getChildrenJSON();
	return this.json;
}
