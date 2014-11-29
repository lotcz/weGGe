weggeSphere.prototype = new weggeObject();
weggeSphere.prototype.constructor = weggeSphere; 

function weggeSphere() {
	this.base = weggeObject;
	this.base();
	
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
	this.wrapper.position.set(this.json.position.x, this.json.position.y, this.json.position.z);
	this.wrapper.rotation.set(this.json.rotation.x, this.json.rotation.y, this.json.rotation.z);
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Sphere");