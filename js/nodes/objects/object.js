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
}

weggeObject.prototype.applyJSON = function( also_children ) {
	this.applyBasic();
}

weggeObject.prototype.basicPropsEdited = function() {
	this.json.position = _getArr(this.wrapper.position);
	this.json.rotation = _getArr(this.wrapper.rotation);
	this.json.scale = _getArr(this.wrapper.scale);
}

weggeObject.prototype.applyBasic = function() {
	_applyArr(this.wrapper.position, this.json.position);
	_applyArr(this.wrapper.rotation, this.json.rotation);
	_applyArr(this.wrapper.scale, this.json.scale);	
}

/* call this.initializeChildren(resources) to initialize all children from resources */
weggeObject.prototype.initializeChildren = function ( resources ) {
	var child_wrapper;	
	for ( var i = 0, max = this.children.length; i < max; i++) {
		child_wrapper = this.children[i].initialize(resources);
		if (child_wrapper) {
			this.addChildWrapper(child_wrapper);
		}
	}
}

weggeObject.prototype.addChildWrapper = function ( wrapper ) {
	if (!this.wrapper) {
		this.wrapper = new THREE.Object3D();
	}
	this.wrapper.add(wrapper);
}

weggeObject.prototype.initialize = function ( resources ) {
	this.initializeChildren(resources);
	this.applyJSON();
	this.initialized = true;
	return this.wrapper;
}

function _applyArr( v, arr ) {
	v.set( arr[0], arr[1], arr[2] );
}

function _getArr( v ) {
	return [v.x,v.y,v.z];
}

function _getColorHex( style ) {
	var c = new THREE.Color();
	c.setStyle(style);
	return c.getHex();
}

weggeNode.prototype.availableTypes.push("Object");