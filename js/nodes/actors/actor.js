weggeActor.prototype = new weggeNode();
weggeActor.prototype.constructor = weggeActor; 

function weggeActor() {
	this.base = weggeNode;
	this.base();	
	
	this.json.type = "Actor";
	this.json.name = "--actor--";
	this.json.enabled = true;
	this.json.target_name = "";	
	
	this.target = null;
}

weggeActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.findNodeByName(this.json.target_name);
	}
}

weggeActor.prototype.act = function(action, args) {
	if (this[action]) {
		this[action](args);
	}
}