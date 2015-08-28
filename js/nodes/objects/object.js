weggeObject.prototype = new weggeNode();
weggeObject.prototype.constructor = weggeObject; 

function weggeObject() {
	this.base = weggeNode;
	this.base();
	this.wrapper = new THREE.Object3D();
	this.initialized = false;
	
	this.json.name = "--object--";
	this.json.type = "Object";
	this.json.position = [0,0,0];
	this.json.rotation = [0,0,0];
	this.json.scale = [1,1,1];
	this.json.physics = 0;
	this.json.mass = 1;
	this.json.selectable = 0;
}

weggeObject.prototype.applyJSON = function() {
	this.applyBasic();
}

weggeObject.prototype.basicPropsEdited = function() {
	this.json.position = _vectorToArray(this.wrapper.position);
	this.json.rotation = _vectorToArray(this.wrapper.rotation);
	this.json.scale = _vectorToArray(this.wrapper.scale);
}

weggeObject.prototype.applyBasic = function() {
	if (this.wrapper && this.wrapper.position) {		
		_applyArrayToVector(this.wrapper.position, this.json.position);
	}
	if (this.wrapper && this.wrapper.rotation) {		
		_applyArrayToVector(this.wrapper.rotation, this.json.rotation);
	}
	if (this.wrapper && this.wrapper.scale) {		
		_applyArrayToVector(this.wrapper.scale, this.json.scale);			
	}	
}

/* call this.initializeChildren(resources) to initialize all children from resources */
weggeObject.prototype.initializeChildren = function ( resources ) {
	var child_wrappers = [];	
	for ( var i = 0, max = this.children.length; i < max; i++) {
		_append(child_wrappers, this.children[i].initialize(resources));		
	}
	for ( var x = 0, maxX = child_wrappers.length; x < maxX; x++) {
		this.addChildWrapper(child_wrappers[x]);
	}
}

weggeObject.prototype.addChildWrapper = function ( wrapper ) {
	if (!this.wrapper) {
		this.wrapper = new THREE.Object3D();
	}
	this.wrapper.add(wrapper);
}

weggeObject.prototype.initialize = function ( resources ) {
	if (resources) {
		this.resources = resources;
	}
	this.initializeChildren(this.resources);	
	this.initialized = true;
	this.applyJSON();
	return this.wrapper;
}

weggeObject.prototype.removeFromScene = function() {
	if (this.wrapper && this.wrapper.parent) {
		this.wrapper.parent.remove(this.wrapper);
		this.wrapper = undefined;
	}
}


weggeNode.prototype.availableTypes.push("Object");