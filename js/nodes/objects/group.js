weggeGroup.prototype = new weggeNode();
weggeGroup.prototype.constructor = weggeGroup; 

function weggeGroup( params ) {
	this.base = weggeNode;
	this.base();
	
	this.json.name = "--GROUP--";
	this.json.type = "Group";
}	
	
weggeGroup.prototype.initialize = function(resources) {
	var child_wrappers = [];	
	for ( var i = 0, max = this.children.length; i < max; i++) {
		_append(child_wrappers, this.children[i].initialize(resources));
	}
	return child_wrappers;
}

weggeNode.prototype.availableTypes.push("Group");