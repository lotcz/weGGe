weggeTexture.prototype = new weggeMaterial();
weggeTexture.prototype.constructor = weggeTexture;    

function weggeTexture() {
	weggeMaterial.call(this);
	this.initialized = false;
	this.json.type = "Texture";
	this.json.name = "--texture--";
	this.json.path = "";
}

weggeTexture.prototype.initialize = function ( onInitialized ) {	
	(function (_this) {
		THREE.ImageUtils.loadTexture( _this.json.path , undefined, 
			function ( texture ) {
				_this.material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:texture } );	
				_this.initialized = true;
				onInitialized();
			},
			 function ( data ) {
				console.log("Cannot load texture " + _this.json.path);
				console.log(data);
				_this.initialized = true;
				onInitialized()
			}
		);
	})(this);	
}

weggeTexture.prototype.renderPreview = function ( ) {
	if (this.material) {		
		var preview = new objectPlane();
		preview.initialize( this );
		return preview;
	}	
}	

weggeResource.prototype.availableTypes.push("Texture");