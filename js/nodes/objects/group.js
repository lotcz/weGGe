weggeGroup.prototype = new weggeNode();
weggeGroup.prototype.constructor = weggeGroup; 

function weggeGroup( params ) {
	this.base = weggeNode;
	this.base();
	
	this.json.name = "--GROUP--";
	this.json.type = "Group";
}	

weggeGroup.prototype.addChildWrapper = function ( wrapper ) {	
	this.addWrapperToParent(wrapper);
}

weggeGroup.prototype.initialize = function(resources) {
	this.initialized = true;
	return this.initializeChildren(resources);
}

weggeNode.prototype.availableTypes.push("Group");