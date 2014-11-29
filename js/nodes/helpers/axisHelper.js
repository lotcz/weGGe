weggeAxisHelper.prototype = new weggeObject();
weggeAxisHelper.prototype.constructor = weggeAxisHelper; 

function weggeAxisHelper() {
	this.base = weggeObject;
	this.base();
	
	this.json.type = "AxisHelper";	
	this.json.color = "#50FF50";
}

weggeAxisHelper.prototype.initialize = function() {
	var dir = new THREE.Vector3( 1, 0, 0 );
	var origin = new THREE.Vector3( 0, 0, 0 );
	var length = 1;
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.ArrowHelper( dir, origin, length, color.getHex() );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("AxisHelper");