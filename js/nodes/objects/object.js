weggeObject.prototype = new weggeNode();
weggeObject.prototype.constructor = weggeObject; 

function weggeObject() {
	this.base = weggeNode;
	this.base();
	
	this.json.type = "Object";
	this.json.position = {x:0,y:0,z:0};
	this.json.rotation = {x:0,y:0,z:0};
	this.json.scale = {x:1,y:1,z:1};
}

weggeObject.prototype.applyBasic = function() {
	this.wrapper.position.set(this.json.position.x, this.json.position.y, this.json.position.z);
	this.wrapper.rotation.set(this.json.rotation.x, this.json.rotation.y, this.json.rotation.z);
	this.wrapper.scale.set(this.json.scale.x, this.json.scale.y, this.json.scale.z);
}


weggeNode.prototype.availableTypes.push("Object");