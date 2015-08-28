function weggeMouse(selectable, camera) {
	
	this.selectable = selectable;
	this.camera = camera;
	this.vector = new THREE.Vector3();
	
	//this.animationFrame = function(delta) {	}
	
	this.mouseDown = function( evt ) {
		this.vector.set(
			( evt.clientX / window.innerWidth ) * 2 - 1,
			-( evt.clientY / window.innerHeight ) * 2 + 1,
			1
		);
		
		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( this.vector, this.camera );
		var intersections = raycaster.intersectObjects( this.selectable );
		
		if ( intersections.length > 0 ) {
			var selected_mesh = intersections[0].object;			
			if (selected_mesh.clickable && selected_mesh.onClick) {
				selected_mesh.onClick();
			}			
		}
	};
	
	this.mouseDownClosure = _bind(this,this.mouseDown);
	
	this.destroy = function() {
		document.removeEventListener( 'mousedown', this.mouseDownClosure );
	}
	
	document.addEventListener( 'mousedown', this.mouseDownClosure );
}
