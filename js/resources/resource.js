function basicResource() {
	this.id = 0;
	this.json = {};
	this.json.type = "";
}

basicResource.prototype.getJSON = function ( ) {
	return JSON.stringify( this.json );	
}