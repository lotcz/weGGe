weggeObject.prototype = new weggeNode();
weggeObject.prototype.constructor = weggeObject; 

function weggeObject() {
	this.base = weggeNode;
	this.base();
	
	this.json.type = "Object";
	this.json.position = [0,0,0];
	this.json.rotation = [0,0,0];
	this.json.scale = [1,1,1];
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

function _applyArr( v, arr ) {
	v.set( arr[0], arr[1], arr[2] );
}

function _getArr( v ) {
	return [v.x,v.y,v.z];
}

weggeNode.prototype.availableTypes.push("Object");