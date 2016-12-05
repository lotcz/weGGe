weggeFont.prototype = new weggeResource();
weggeFont.prototype.constructor = weggeFont;    

function weggeFont() {
	weggeResource.call(this);
	this.initialized = false;
	this.json.type = "Font";
	this.json.name = "font";
	this.json.path = "";
}

weggeFont.prototype.initialize = function ( onInitialized ) {	
	(function (_this) {
		var loader = new THREE.FontLoader();
						
		try {
			loader.load( _this.json.path,  
				function ( response ) {	
					_this.font = response;
				
					_this.initialized = true;
					onInitialized();
				},
				undefined,
				function ( data ) {
					console.log("Cannot load font " + _this.json.path);
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

weggeResource.prototype.availableTypes.push("Font");