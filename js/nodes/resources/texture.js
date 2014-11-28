weggeTexture.prototype = new weggeResource();
weggeTexture.prototype.constructor = weggeResource;    

function weggeTexture() {
}

weggeTexture.prototype.initialize = function ( onInitialized ) {	
	(function (_this) {
		THREE.ImageUtils.loadTexture( _this.json.path , undefined, 
			function ( texture ) {
				_this.material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:texture } );	
				_this.initialized = true;
				onInitialized();
			}
		);
	})(this);	
}

weggeTexture.prototype.renderHUDList = function ( onclick ) {
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

weggeTexture.prototype.renderHUDPreview = function ( ) {
	if (this.material) {		
		var preview = new objectPlane();
		preview.initialize( this );
		return preview;
	}	
}	