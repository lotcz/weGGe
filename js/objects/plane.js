function objectPlane( id, json ) {	
	this.id = _coalesce(id, 0);
	this.json = _coalesce( json, {} );
}

objectPlane.prototype.initialize = function ( resources ) {
	var res;
	if (resources.material) {
		res = resources;
	} else {
		res = resources.getById( this.json.material_id );
	}
	var geometry = new THREE.PlaneGeometry(100, 100, 100);
	this.wrapper = new THREE.Mesh( geometry, res.material );	
	//this.wrapper.rotation.y = Math.PI/2;
	this.wrapper.scale.set(50, 50, 50);
}

objectPlane.prototype.addToScene = function ( scene ) {
	scene.add( this.wrapper );
}

objectPlane.prototype.removeFromScene = function ( scene ) {
	scene.remove( this.wrapper );
}