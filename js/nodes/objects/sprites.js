weggeSprite.prototype = new weggeObject();
weggeSprite.prototype.constructor = weggeSprite; 

function weggeSprite() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "sprite";
	this.json.type = "Sprite";
	this.json.material_resource_id = "material_name";
}

weggeSprite.prototype.initialize = function ( resources ) {
	var material;
	
	if (resources) {
		var res = resources.getById( this.json.material_resource_id );
		if (res && res.material) {
			material = res.material;
		} else {
			console.log("Material not found:" + this.json.material_resource_id );
		}
	}
	
	if (material) {
		this.wrapper = new THREE.Sprite( material );
	}
		
	this.applyBasic();
	return this.wrapper;	
}

weggeSprite.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Sprite");