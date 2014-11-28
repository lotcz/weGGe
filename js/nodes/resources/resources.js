weggeResources.prototype = new weggeNode();
weggeResources.prototype.constructor = weggeResources; 

function weggeResources() {
	weggeNode.call(this);
	this.resources = [];
	this.initialized = false;
}

weggeResources.prototype.loadFromJSON = function ( json ) {	
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
	this.missing = json.length;
}

weggeResources.prototype.getById = function ( id ) {
	for (var i = 0, max = this.resources.length; i < max; i++ ){
		if (this.resources[i].id == id) {
			return this.resources[i];
		}
	}
}

weggeResources.prototype.initialize = function ( onInitialized ) {
	for ( var i = 0, max = this.resources.length; i < max; i++) {
		(function(_this) {
			_this.resources[i].initialize(
				function() {
					_this.missing -= 1;
					if (_this.missing == 0) {
						_this.initialized = true;
						onInitialized();
					}
				}
			);		
		})(this);
	}
}
	
weggeResources.prototype.availableTypes = ["Model", "Texture"];