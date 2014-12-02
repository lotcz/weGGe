weggeDepthOfField.prototype = new weggeNode();
weggeDepthOfField.prototype.constructor = weggeDepthOfField; 

function weggeDepthOfField() {
	this.base = weggeNode;
	this.base();
	
	this.json.name = "--depth-of-field--";
	this.json.type = "DepthOfField";
}

weggeDepthOfField.prototype.initialize = function(host3D, resources) {
	var depthOfField= new THREEx.DepthOfField(renderer);
	updateFcts.push(function(){
		depthOfField.render(scene, camera)
	})
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("DepthOfField");