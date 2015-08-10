weggeSkybox.prototype = new weggeObject();
weggeSkybox.prototype.constructor = weggeSkybox; 

function weggeSkybox( params ) {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--skybox--";
	this.json.type = "Skybox";
	this.json.size = 10000;	
	this.json.color = "#FF5050";
	this.json.path = "res/skybox";
	this.json.imagename = "abovesea";
}	
	
weggeSkybox.prototype.initialize = function() {
	var imagePrefix = this.json.path + "/" + this.json.imagename + "-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	this.size = _coalesce( this.json.size, 10000 );
	var skyGeometry = new THREE.CubeGeometry( this.size, this.size, this.size );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	this.wrapper = new THREE.Mesh( skyGeometry, new THREE.MeshFaceMaterial( materialArray ) );
	
	/*
	if (params.camera) {
		this.wrapper.position = params.camera.position;
	}
	*/
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Skybox");