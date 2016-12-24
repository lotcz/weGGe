weggeModel.prototype = new weggeResource();
weggeModel.prototype.constructor = weggeModel;    

function weggeModel() {
	weggeResource.call(this);
	this.initialized = false;
	this.json.type = "Model";
	this.json.name = "--model--";
	this.json.path = "";
	this.json.morphTargets = false;
}

weggeModel.prototype.initialize = function ( onInitialized ) {	
	(function (_this) {
		var loader = new THREE.JSONLoader();
		
		try {
			loader.load( _this.json.path,  
				function ( geometry, materials ) {	
					//console.log(geometry);
					//console.log(materials);
					
					for (var m = 0, maxm = materials.length; m < maxm; m++) {
						materials[m].side = THREE.DoubleSide;
						materials[m].morphTargets = _this.json.morphTargets;
						//materials[m].morphNormals = true;
					}
					_this.material = new THREE.MeshFaceMaterial( materials );
					//material.vertexColors = THREE.FaceColors;
					_this.geometry = geometry;
				
					_this.initialized = true;
					onInitialized();
				},
				undefined,
				 function ( data ) {
					console.log("Cannot load model " + _this.json.path);
					console.log(data);
					_this.initialized = true;
					onInitialized()
				}
			);
		} catch (e) {
			_this.initialized = true;
			onInitialized();
			console.log(e);
		}
	})(this);	
	
}

weggeModel.prototype.renderHUDPreview = function ( ) {
	if (this.material && this.geometry) {		
		var preview = new objectMesh();
		preview.initialize( this );
		return preview;
	}	
}	

weggeResource.prototype.availableTypes.push("Model");