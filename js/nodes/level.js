weggeLevel.prototype = new weggeNode();
weggeLevel.prototype.constructor = weggeLevel; 

function weggeLevel() {
	this.base = weggeNode;
	this.base();	
	this.id = 0;
	this.json.type = "Level";
	this.json.name = "";
	this.json.clearColor = "#000000";
	this.json.cameraLatitude = -10;
	this.json.cameraLongitude = 260;
	this.json.cameraPosition = [100,100,1000];
	this.json.cameraFov = 45;
	this.json.cameraAspect = 1;
	this.json.cameraNear = 1;
	this.json.cameraFar = 10000;
	this.json.physics = 0;
	this.json.gravity = [0,0,-900];
	this.json.lookEnabled = 0;
	this.json.renderingPaused = 0;
	this.json.animationPaused = 0;
	this.json.physicsPaused = 0;
	
	this.json.creator = {};
	this.json.creator.lookEnabled = 0;
	this.json.creator.renderingPaused = 0;
	this.json.creator.animationPaused = 0;
	this.json.creator.physicsPaused = 0;
	
	this.animated = [];
	this.selectable = [];
	this.host3D = false;
}

weggeLevel.prototype.applyJSON = function() {
	if (this.host3D) {
		this.host3D.renderer.setClearColor( _coalesce(this.json.clearColor, 0x101010) );
		_applyArrayToVector(this.host3D.camera.position, this.json.cameraPosition);
	}
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
		for ( var i = 0, max = node.children.length; i < max; i++) {
			this.buildNodeAnimatedArray(node.children[i]);
		}
	}
}

weggeLevel.prototype.buildAnimatedArray = function() {	
	this.animated = [];
	if (this.children) {
		for ( var i = 0, max = this.children.length; i < max; i++) {
			this.buildNodeAnimatedArray(this.children[i]);
		}
	}	
}

weggeLevel.prototype.buildNodeSelectableArray = function(node) {	
	if (node.json.selectable) {
		this.selectable.push(node.wrapper);
	}
	if (node.children) {
		for ( var i = 0, max = node.children.length; i < max; i++) {
			this.buildNodeSelectableArray(node.children[i]);
		}
	}
}

weggeLevel.prototype.buildSelectableArray = function() {	
	this.selectable = [];
	if (this.children) {
		for ( var i = 0, max = this.children.length; i < max; i++) {
			this.buildNodeSelectableArray(this.children[i]);
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
	this.json.cameraFov = _coalesce(this.json.cameraFov, 45);
	this.json.cameraAspect = _coalesce(this.json.cameraAspect, 1);
	this.json.cameraNear = _coalesce(this.json.cameraNear, 1);
	this.json.cameraFar = _coalesce(this.json.cameraFar, 10000);
	
	this.json.physics = _boolToInt(_coalesce(this.json.physics,0));
	this.json.gravity = _coalesce(this.json.gravity, [0,0,-900]);
	
	this.json.lookEnabled = parseInt(_coalesce(this.json.lookEnabled,0));
	this.json.renderingPaused = parseInt(_coalesce(this.json.renderingPaused,0));
	this.json.animationPaused = parseInt(_coalesce(this.json.animationPaused,0));
	this.json.physicsPaused = parseInt(_coalesce(this.json.physicsPaused,0));
	
	if (!this.json.creator) {
		this.json.creator = {};
	}
	
	this.json.creator.lookEnabled = parseInt(_coalesce(this.json.creator.lookEnabled,0));
	this.json.creator.renderingPaused = parseInt(_coalesce(this.json.creator.renderingPaused,0));
	this.json.creator.animationPaused = parseInt(_coalesce(this.json.creator.animationPaused,0));
	this.json.creator.physicsPaused = parseInt(_coalesce(this.json.creator.physicsPaused,0));
		
	this.loadChildrenFromJSON(json);	
	return this;
}

weggeLevel.prototype.initialize = function ( host3D, resources ) {
	this.host3D = host3D;	
	if (this.json.physics > 0) {
		this.host3D.initScenePhysics(this.json);		
	} else {
		this.host3D.initScene(this.json);
	}
	
	var wrappers = [];	
	for (var i = 0, max = this.children.length; i < max; i++ ) {
		_append(wrappers, this.children[i].initialize(resources));
	}
	for (var i = 0, max = wrappers.length; i < max; i++ ) {
		this.host3D.scene.add(wrappers[i]);
	}
	
	this.applyJSON();
	this.buildAnimatedArray();
	this.buildSelectableArray();
	this.initialized = true;
}