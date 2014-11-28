function weggeNode() {
	this.json = {};
	this.children = [];
	this.initialized = false;
}

/* set this.json.children = this.getChildrenJSON() to gather json from all node's children */
weggeNode.prototype.getChildrenJSON = function() {
	var children = [];
	for ( var i = 0, max = this.children.length; i < max; i++) {
		children.push(this.children[i].getJSON());
	}
	return children;
}

/* call this.loadChildrenFromJSON(json) to create children */
weggeNode.prototype.loadChildrenFromJSON = function(json) {
	if (json.children) {
		this.children = [];
		var child, child_json;
		for ( var i = 0, max = json.children.length; i < max; i++) {
			child_json = json.children[i];
			child = new window["wegge" + child_json.type]();
			child.loadFromJSON(child_json);
			this.children.push(child);
		}
	} else {
		this.children = false;
	}
}

/* CAN OVERRIDE */

weggeNode.prototype.loadFromJSON = function(json) {
	this.json = json;	
	/* prepare node */

	/**/	
	
	this.loadChildrenFromJSON(json);	
	return this;
}

weggeNode.prototype.getJSON = function() {
	/* perform updates to this.json */

	/**/
	
	this.json.children = this.getChildrenJSON();
	return this.json;
}

weggeNode.prototype.availableTypes = ["Node"];