function objectMesh( id, json ) {
	this.json = _coalesce( json, {} );
	this.id = _coalesce(id, 0);
	
}

objectMesh.prototype.initialize = function ( resources ) {
	var res;
	if (resources.geometry && resources.material) {
		res = resources;
	} else {
		res = resources.getById( this.json.model_id );
	}
	this.wrapper = new THREE.Mesh( res.geometry, res.material );	
	this.wrapper.scale.set(100, 100, 100);
}

objectMesh.prototype.addToScene = function ( scene ) {
	scene.add( this.wrapper );
}

objectMesh.prototype.removeFromScene = function ( scene ) {
	scene.remove( this.wrapper );
}