weggeModel.prototype = new weggeResource();
weggeModel.prototype.constructor = weggeModel;    

function weggeModel() {
	weggeResource.call(this);
	this.initialized = false;
	this.json.type = "Model";
	this.json.name = "--model--";
	this.json.path = "";
}

weggeModel.prototype.initialize = function ( onInitialized ) {	
	(function (_this) {
		var loader = new THREE.JSONLoader();
		loader.load( _this.json.path,  
			function ( geometry, materials ) {	
				for (var m = 0, maxm = materials.length; m < maxm; m++) {
					materials[m].side = THREE.DoubleSide;
					materials[m].morphTargets = true;
					//materials[m].morphNormals = true;
				}
				_this.material = new THREE.MeshFaceMaterial( materials );
				//material.vertexColors = THREE.FaceColors;
				_this.geometry = geometry;
			
				_this.initialized = true;
				onInitialized();
			},
			 function ( data ) {
				console.log("Cannot load model " + _this.json.path);
				console.log(data);
				_this.initialized = true;
				onInitialized()
			}
		);
	})(this);	
	
}

weggeModel.prototype.renderHUDList = function ( onclick ) {
	var wrapper = $("<div class=\"list-item\"></div>");
	var link = $("<div class=\"hud-menu-link\"></div>").appendTo(wrapper);
	link.append("<div class=\"column column-id\">" + this.id + "</div>");
	link.append("<div class=\"column column-type\">" + this.json.type + "</div>");
	link.append("<div class=\"column column-desc\">" + this.json.path + "</div>");
	if (onclick) {
		link.bind( "click", onclick);
	}
	return wrapper;
}	

weggeModel.prototype.renderHUDPreview = function ( ) {
	if (this.material && this.geometry) {		
		var preview = new objectMesh();
		preview.initialize( this );
		return preview;
	}	
}	

weggeResource.prototype.availableTypes.push("Model");