textureResource.prototype = new basicResource();
textureResource.prototype.constructor = textureResource;    

function textureResource( id, json ) {
	this.id = _coalesce( id, 0);
	if (json) {
		this.json = json;
	} else {
		this.json.type = "texture"
		this.json.path = "";
	}
}

textureResource.prototype.getJSON = function ( ) {
	return JSON.stringify( this.json );	
}

textureResource.prototype.renderHUDList = function ( onclick ) {
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

textureResource.prototype.renderHUDPreview = function ( ) {
	if (this.material) {		
		var preview = new objectPlane();
		preview.initialize( this );
		return preview;
	}	
}	