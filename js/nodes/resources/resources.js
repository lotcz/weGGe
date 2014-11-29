weggeResources.prototype = new weggeNode();
weggeResources.prototype.constructor = weggeResources; 

function weggeResources() {
	weggeNode.call(this);
	this.resources = [];
	this.initialized = false;
}

weggeResources.prototype.loadFromJSON = function ( json ) {	
	this.initialized = false;
	var resource, resource_id, resource_json;	
	for (var i = 0, max = json.length; i < max; i++ ){
		resource_id = json[i].resource_id;
		try {
			resource_json = JSON.parse( json[i].resource_json );	
		} catch (e) {
			resource_json = {};
			console.log("Resource " + resource_id + ", \"" + json[i] + "\" is not valid JSON.");
		}
		resource = new window["wegge" + resource_json.type]();
		resource.loadFromJSON( parseInt(resource_id), resource_json);
		this.resources.push( resource );		
	}	
}

weggeResources.prototype.getById = function ( id ) {
	for (var i = 0, max = this.resources.length; i < max; i++ ){
		if (this.resources[i].id == id) {
			return this.resources[i];
		}
	}
}

weggeResources.prototype.resourceInitialized = function() {
	this.missing -= 1;
	if (this.missing == 0) {
		this.initialized = true;
		this.onInitialized();
	}
}

weggeResources.prototype.initialize = function () {
	this.missing = this.resources.length;
	for ( var i = 0, max = this.resources.length; i < max; i++) {
		this.resources[i].initialize( _bind(this, this.resourceInitialized) );		
	}
}
	
weggeResources.prototype.availableTypes = ["Model", "Texture"];