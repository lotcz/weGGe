weggeResources.prototype = new weggeNode();
weggeResources.prototype.constructor = weggeResources; 

function weggeResources() {
	weggeNode.call(this);
	this.initialized = false;
}

weggeResources.prototype.loadFromJSON = function ( json ) {	
	this.initialized = false;
	var resource, resource_id, resource_json;	
	for (var i = 0, max = json.length; i < max; i++ ){
		resource_id = json[i].resource_id;
		try {
			resource_json = JSON.parse( json[i].resource_json );	
			resource = new window["wegge" + resource_json.type]();
			resource.loadFromJSON( parseInt(resource_id), resource_json);
			this.children.push( resource );		
		} catch (e) {
			resource_json = {};
			console.log("Resource " + resource_id + ", \"" + json[i].resource_json + "\" is not valid JSON.");
		}
		
	}	
}

weggeResources.prototype.getById = function ( id ) {
	for (var i = 0, max = this.children.length; i < max; i++ ){
		if (this.children[i].id == id) {
			return this.children[i];
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
	this.missing = this.children.length;
	if (this.missing == 0) {
		this.initialized = true;
		this.onInitialized();
	} else {
		for ( var i = 0, max = this.children.length; i < max; i++) {
			this.children[i].initialize( _bind(this, this.resourceInitialized) );		
		}
	}
}