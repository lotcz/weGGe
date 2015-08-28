weggeResources.prototype = new weggeNode();
weggeResources.prototype.constructor = weggeResources; 

function weggeResources() {
	weggeNode.call(this);
	this.initialized = false;
}

weggeNode.prototype.addResource = function(json, id) {	
	var resource = this.createNode(json);
	resource.id = id;
	this.children.push( resource );	
}

weggeResources.prototype.loadFromJSON = function ( json ) {	
	this.initialized = false;
	var resource, resource_id, resource_json;	
	for (var i = 0, max = json.length; i < max; i++ ){
		resource_id = json[i].resource_id;
		try {
			resource_json = JSON.parse( json[i].resource_json );	
			this.addResource( resource_json, parseInt(resource_id));			
		} catch (e) {
			resource_json = {};
			console.log("Resource " + resource_id + ", \"" + json[i].resource_json + "\" is not valid JSON.");
		}
		
	}	
}

weggeResources.prototype.getByName = function ( name ) {
	for (var i = 0, max = this.children.length; i < max; i++ ){
		if (this.children[i].json.name == name) {
			return this.children[i];
		}
	}
	return null;
}

weggeResources.prototype.getById = function ( id ) {
	var res = this.getByName(id);
	if (res !== null) {
		return res;
	} else {	
		for (var i = 0, max = this.children.length; i < max; i++ ){
			if (this.children[i].id == id) {
				return this.children[i];
			}
		}
	}
	return null;
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