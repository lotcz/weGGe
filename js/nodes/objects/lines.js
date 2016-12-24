weggePoint.prototype = new weggeNode();
weggePoint.prototype.constructor = weggePoint; 

function weggePoint() {
	this.base = weggeNode;
	this.base();
	
	this.json.name = "point";
	this.json.type = "Point";
	this.json.position = [0,0,0];
	
}

weggePoint.prototype.applyBasic = function() {
	if (this.wrapper && this.wrapper.position) {		
		_applyArrayToVector(this.wrapper.position, this.json.position);
	}	
}

weggePoint.prototype.basicPropsEdited = function() {
	this.json.position = _vectorToArray(this.wrapper.position);	
	if (this.parent && this.parent.updateLineGeometry) {
		this.parent.updateLineGeometry();
	}
}

weggePoint.prototype.applyJSON = function() {
	this.applyBasic();
}

weggePoint.prototype.initialize = function ( resources ) {
	this.wrapper = new THREE.Object3D();
	this.applyBasic();
	return this.wrapper;	
}

weggePoint.prototype.getRequiredResources = function() {
	return false;
}

weggeNode.prototype.availableTypes.push("Point");

weggeLine.prototype = new weggeObject();
weggeLine.prototype.constructor = weggeLine; 

function weggeLine() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--Line--";
	this.json.type = "Line";
	this.json.color = "#1010E0";
	this.json.material_resource_id = 0;
	this.json.children = [];
	this.addChild(new weggePoint());
	this.addChild(new weggePoint());
	this.line = null;
}

weggeLine.prototype.removeFromScene = function() {
	if (this.wrapper && this.wrapper.parent) {
		this.wrapper.parent.remove(this.wrapper);
		this.wrapper = undefined;
	}
}

weggeLine.prototype.updateLineGeometry = function() {
	if (this.json.children && this.line) {
		for (var i = 0,max = this.children.length; i < max; i++) {	
			if (this.line.geometry.vertices[i]) {
				this.line.geometry.vertices[i].copy( _arrayToVector(this.children[i].json.position) );
			}
		}
		this.line.geometry.verticesNeedUpdate = true;
	}	
}

weggeLine.prototype.initialize = function ( resources ) {
	this.resources = _coalesce(resources, this.resources);
	this.removeFromScene();
		
	var geometry, material;
	var geometry = new THREE.Geometry();
	
	if (this.json.children) {
		for (var i = 0,max = this.children.length; i < max; i++) {		
			geometry.vertices.push( _arrayToVector(this.children[i].json.position) );
		}
	}
	
	var res = this.resources.getById( this.json.material_resource_id );
	if (res && res.material) {
		material = res.material;
	} else {
		var color = new THREE.Color();
		color.setStyle(this.json.color);
		material = new THREE.LineBasicMaterial({color:color,linewidth:10 });
	}
	this.line = new THREE.Line( geometry, material );	
	
	if (WEGGE_CREATOR_MODE) {
		this.wrapper = new THREE.Object3D();
		this.wrapper.add(this.line);
		this.initializeChildren(this.resources);
	} else {
		this.wrapper = this.line;
	}
	this.applyBasic();
	return this.wrapper;	
}

weggeLine.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Line");
