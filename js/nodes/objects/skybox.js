function weggeSkybox( params ) {
	var imagePrefix = _coalesce(params.path, "../images/skybox/") + params.name + "-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	this.size = _coalesce( params.size, 75000 );
	var skyGeometry = new THREE.CubeGeometry( this.size, this.size, this.size );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	this.wrapper = new THREE.Mesh( skyGeometry, new THREE.MeshFaceMaterial( materialArray ) );
	
	if (params.camera) {
		this.wrapper.position = params.camera.position;
	}
}
