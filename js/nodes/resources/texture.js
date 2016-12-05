weggeTexture.prototype = new weggeMaterial();
weggeTexture.prototype.constructor = weggeTexture;    

function weggeTexture() {
	weggeMaterial.call(this);
	this.initialized = false;
	this.json.type = "Texture";
	this.json.name = "--texture--";
	this.json.color = "#FFFFFF";
	this.json.path = "";
	this.json.repeatS = 0;
	this.json.repeatT = 0;	
}

weggeTexture.prototype.initialize = function ( onInitialized ) {	
	this.json.material_type = _coalesce(this.json.material_type, "MeshBasicMaterial");
	this.json.color = _coalesce(this.json.color, "#FFFFFF");
	
	(function (_this) {
		var loader = new THREE.TextureLoader();
		
		loader.load( 
			_this.json.path, 
			function ( texture ) {
				if (texture && texture.image) {
				if (parseInt(_this.json.repeatS) > 0 || parseInt(_this.json.repeatT) > 0) {
					
					/*
					THREE.UVMapping
					THREE.CubeReflectionMapping
					THREE.CubeRefractionMapping
					 THREE.SphericalReflectionMapping
					*/
					//texture.mapping = THREE.CubeReflectionMapping; 
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;//THREE.MirroredRepeatWrapping
					texture.repeat.set( parseInt(_this.json.repeatS), parseInt(_this.json.repeatT) );
				}
					_this.material = new THREE[_this.json.material_type]( { color: _this.json.color, side: THREE.DoubleSide, map:texture } );
				} else {
					console.log("Texture invalid");
					console.log(texture);
				}
				_this.initialized = true;
				onInitialized();
			},
			undefined,
			function ( data ) {
				console.log("Cannot load texture " + _this.json.path);
				console.log(data);
				_this.initialized = true;
				onInitialized();
			}
		);
	})(this);	
}

weggeTexture.prototype.renderPreview = function ( ) {
	return $("<img></img>").attr("src",this.json.path).css({maxHeight:"480px",maxWidth:"640px"});
}	

weggeResource.prototype.availableTypes.push("Texture");