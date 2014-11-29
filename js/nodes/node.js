function weggeNode() {
	this.json = {};
	this.json.name = "--node--";
	this.json.type = "Node";
	this.children = [];	
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

/* call this.loadChildrenFromJSON(json) to create children */
weggeNode.prototype.loadChildrenFromJSON = function(json) {
	this.children = [];
	if (json.children) {		
		var child, child_json;
		for ( var i = 0, max = json.children.length; i < max; i++) {
			child_json = json.children[i];
			if (child_json.type) {
				if (window["wegge" + child_json.type]) {
					child = new window["wegge" + child_json.type]();
					child.loadFromJSON(child_json);
				} else {
					console.log("Type not available: " + child_json.type);
				}
			} else {
				console.log("Type must be specified.");
			}
			this.children.push(child);
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

/* call this.initializeChildren(resources) to initialize all children from resources */
weggeNode.prototype.initializeChildren = function ( resources ) {
	var child_wrapper;	
	for ( var i = 0, max = this.children.length; i < max; i++) {
		child_wrapper = this.children[i].initialize(resources);
		if (child_wrapper) {
			this.addChildWrapper(child_wrapper);
		}
	}
}

weggeNode.prototype.addChildWrapper = function ( wrapper ) {
	if (!this.wrapper) {
		this.wrapper = new THREE.Object3D();
	}
	this.wrapper.add(wrapper);
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

/* CAN OVERRIDE */

weggeNode.prototype.initialize = function ( resources ) {
	/* add node's type initialization */
		//this.wrapper = new THREE.Object3D();
	/**/
	
	this.initializeChildren(resources);
	return this.wrapper;
}

weggeNode.prototype.availableTypes = ["Node"];