weggeLevel.prototype = new weggeNode();
weggeLevel.prototype.constructor = weggeLevel; 

function weggeLevel() {
	this.base = weggeNode;
	this.base();
	this.initialized = false;
	this.id = 0;
	this.json.type = "Level";
	this.json.name = "";
	this.json.ambientLight = "#FFFFFF";
	this.json.clearColor = "#000000";
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