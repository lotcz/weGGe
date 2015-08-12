weggeNode.prototype.availableTypes = [];

function weggeNode() {
	this.parent = false;
	this.json = {};
	this.json.name = "--node--";
	this.json.type = "Node";
	this.children = [];	
}

/* inherit and update scene from here */
weggeNode.prototype.applyJSON = function( also_children ) {
	
}

weggeNode.prototype.removeNode = function( node ) {
	for ( var i = this.children.length-1; i >= 0; i--) {
		if (this.children[i] === node) {
			this.children.splice(i, 1);
			return true;
		} else {
			this.children[i].removeNode(node);
		}
	}
}

/* set this.json.children = this.getChildrenJSON() to gather json from all node's children */
weggeNode.prototype.getChildrenJSON = function() {
	var children = [];
	for ( var i = 0, max = this.children.length; i < max; i++) {
		children.push(this.children[i].getJSON());
	}
	return children;
}

weggeNode.prototype.createNode = function(json) {	
	var node;
	if (json.type) {
		if (window["wegge" + json.type]) {
			node = new window["wegge" + json.type]();
			node.loadFromJSON(json);
		} else {
			console.log("Type not available: " + json.type);
		}
	} else {
		console.log("Type must be specified.");
	}
	return node;
}		

weggeNode.prototype.addChild = function(child) {
	child.parent = this;
	this.children.push(child);
}

/* call this.loadChildrenFromJSON(json) to create children */
weggeNode.prototype.loadChildrenFromJSON = function(json) {
	this.children = [];
	if (json.children) {		
		var child, child_json;
		for ( var i = 0, max = json.children.length; i < max; i++) {
			child = this.createNode(json.children[i]);			
			this.addChild(child);			
		}
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

	if (this.children.length > 0) {
		this.json.children = this.getChildrenJSON();
	} else {
		delete this.json["children"];
	}
	return this.json;
}

weggeNode.prototype.clone = function () {
	var clone = this.createNode( this.json );
	return clone;
}

weggeNode.prototype.getChildrenRequiredResources = function() {
	var required = [];
	for ( var i = 0, max = this.children.length; i < max; i++) {
		_appendIfNotExist(required, this.children[i].getRequiredResources());
	}
	return required;
}

weggeNode.prototype.getRequiredResources = function() {
	var required = [];
	/* add node's specific resources here */ 
	
	/**/
	_appendIfNotExist(required, this.getChildrenRequiredResources());
	return required;
}

weggeNode.prototype.initializeChildren = function ( resources ) {
	for ( var i = 0, max = this.children.length; i < max; i++) {
		this.children[i].initialize(resources);		
	}
}

weggeNode.prototype.initialize = function ( resources ) {
	this.initializeChildren(resources);
	this.applyJSON();
	this.initialized = true;
}

weggeNode.prototype.findNodeByName = function ( name ) {
	if (this.json.name == name) {
		return this;
	} else {
		if (this.children && this.children.length > 0) {
			var node;
			for ( var i = 0, max = this.children.length; i < max; i++) {
				node = this.children[i].findNodeByName(name);
				if (node) return node;
			}			
		}
		return false;
	}
}