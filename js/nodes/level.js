weggeLevel.prototype = new weggeNode();
weggeLevel.prototype.constructor = weggeLevel; 

function weggeLevel() {
	this.base = weggeNode;
	this.base();
	this.wrapper = new THREE.Object3D();
	this.initialized = false;
	this.id = 0;
	this.json.type = "Level";
	this.json.name = "";
	this.json.ambientLight = "#FFFFFF";
	this.json.clearColor = "#000000";
	this.json.cameraLatitude = 0;
	this.json.cameraLongitude = 0;
	this.json.cameraPosition = [0,0,0];
	this.animated = [];
}

weggeLevel.prototype.animationFrame = function(delta) {
	for ( var i = 0, max = this.animated.length; i < max; i++) {
		this.animated[i].animationFrame(delta);
	}
}

weggeLevel.prototype.buildNodeAnimatedArray = function(node) {	
	if (node.animationFrame) {
		this.animated.push(node);
	}
	if (node.children) {
		for ( var i = 0, max = this.children.length; i < max; i++) {
			this.buildNodeAnimatedArray(node.children[i]);
		}
	}
}

weggeLevel.prototype.buildAnimatedArray = function() {	
	this.animated = [];
	if (this.children) {
		for ( var i = 0, max = this.children.length; i < max; i++) {
			this.buildNodeAnimatedArray(node.children[i]);
		}
	}	
}

/* OVERRIDEN FROM weggeNODE */

weggeLevel.prototype.loadFromJSON = function(id, json) {
	this.initialized = false;	
	this.id = id;
	this.json = json;
	if ((!this.json.name) || this.json.name.length == 0) {
		this.json.name = "LEVEL " + this.id;
	}
	this.json.cameraLatitude = _coalesce(this.json.cameraLatitude, 0);
	this.json.cameraLongitude = _coalesce(this.json.cameraLongitude, 0);
	this.json.cameraPosition = _coalesce(this.json.cameraPosition, [0,0,0]);
	
	this.loadChildrenFromJSON(json);	
	return this;
}

weggeLevel.prototype.initialize = function ( resources ) {
	this.initializeChildren(resources);
	this.initialized = true;
	return this.wrapper;
}