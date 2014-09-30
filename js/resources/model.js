modelResource.prototype = new basicResource();
modelResource.prototype.constructor = modelResource;    

function modelResource( id, json ) {
	this.id = _coalesce( id, 0);
	if (json) {
		this.json = json;
	} else {
		this.json.type = "model"
		this.json.path = "";
	}
}

modelResource.prototype.renderHUDList = function ( onclick ) {
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

modelResource.prototype.renderHUDPreview = function ( ) {
	if (this.material && this.geometry) {		
		var preview = new objectMesh();
		preview.initialize( this );
		return preview;
	}	
}	