weggeSphere.prototype = new weggeObject();
weggeSphere.prototype.constructor = weggeSphere; 

function weggeSphere() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--sphere--";
	this.json.type = "Sphere";
	this.json.radius = 100;
	this.json.widthSegments = 10;
	this.json.heightSegment = 10;
	this.json.color = "#FF5050";
}

weggeSphere.prototype.initialize = function() {
	var geometry = new THREE.SphereGeometry(this.json.radius, this.json.widthSegments, this.json.heightSegments);
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:color}) );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Sphere");