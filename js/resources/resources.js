function tingResources( params ) {
	this.resources = [];
}

tingResources.prototype.loadFromJSON = function ( json ) {
	this.resources = [];
	var resource_id, resource_json;	
	for (var i = 0, max = json.length; i < max; i++ ){
		resource_id = json[i].resource_id;
		try {
			resource_json = $.parseJSON( json[i].resource_json );	
		} catch (e) {
			resource_json = {};
			console.log("Resource " + resource_id + ", \"" + json[i] + "\" is not valid JSON.");
		}
		switch (resource_json.type) {
			case "model" :
				this.resources.push( new modelResource( resource_id, resource_json ) );
			break;
			case "texture" :
				this.resources.push( new textureResource( resource_id, resource_json ) );
			break;
		}
	}
}

tingResources.prototype.getById = function ( id ) {
	for (var i = 0, max = this.resources.length; i < max; i++ ){
		if (this.resources[i].id == id) {
			return this.resources[i];
		}
	}
}

tingResources.prototype.initialize = function ( ) {
	for (var i = 0; i < this.resources.length; i++) {		
		(function (_this,_resource) {
			switch (_resource.json.type) {
				case "model" :
					var loader = new THREE.JSONLoader( );
					loader.load( _resource.json.path, 
						function ( geometry, materials ) {
							for (var m = 0, maxm = materials.length; m < maxm; m++) {
								materials[m].side = THREE.DoubleSide;
							}
							_resource.material = new THREE.MeshFaceMaterial( materials );	
							_resource.geometry = geometry;									
						}
					);			
					break;
				case "texture" :
					THREE.ImageUtils.loadTexture( _resource.json.path , undefined, 
						function ( texture ) {
							_resource.material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:texture } );	
						}
					);
				break;
			}
		}(this, this.resources[i]));	
	}
}
	
tingResources.prototype.availableResourceTypes = ["model", "texture"];