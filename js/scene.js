function weggeScene( params ) {
	this.scene = new THREE.Scene();
	this.animated = [];
	this.objects = [];

	/* camera*/
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000000 );
	this.camera.position.set( -3000, 3000, -3000 );
	this.camera.lookAt( 0, 0, 0);
	this.scene.add(this.camera);
	
	this.ambientLight = new THREE.AmbientLight(0xf0f0f0);
	this.scene.add(this.ambientLight);
	
}

weggeScene.prototype.add = function ( object ) {
	this.objects.push( object );
	object.addToScene( this.scene );
}

weggeScene.prototype.remove = function ( object ) {
	_remove(this.objects, object );
	object.removeFromScene( this.scene );
}

weggeScene.prototype.removeAll = function ( ) {
	for(var i = 0, max = this.objects.length; i < max; i++) {
		this.remove(this.objects[i]);
	}
}

weggeScene.prototype.render = function ( renderer ) {
	renderer.render( this.scene, this.camera );	
}

weggeScene.prototype.loadFromJSON = function ( json, resources ) {

	
}

weggeScene.prototype.animationFrame = function ( delta ) {
	
}

weggeScene.prototype.onWindowResize = function ( width, height ) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();	
}