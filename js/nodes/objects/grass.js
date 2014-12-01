weggeGrass.prototype = new weggeObject();
weggeGrass.prototype.constructor = weggeGrass; 

function weggeGrass() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--grass--";
	this.json.type = "Grass";
}

weggeGrass.prototype.initialize = function() {	
	THREEx.createGrassTufts.baseUrl	= "lib/";
	
	var nTufts	= 5000
	var positions	= new Array(nTufts)
	for(var i = 0; i < nTufts; i++){
		var position	= new THREE.Vector3()
		position.x	= (Math.random()-0.5)*20
		position.z	= (Math.random()-0.5)*20
		positions[i]	= position
	}
	var mesh	= THREEx.createGrassTufts(positions)
	this.wrapper.add(mesh)

	// load the texture
	var textureUrl		= THREEx.createGrassTufts.baseUrl+'images/grass01.png'
	var material		= mesh.material
	material.map		= THREE.ImageUtils.loadTexture(textureUrl)
	material.alphaTest	= 0.7

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	
	var nTufts	= 5000
	var positions	= new Array(nTufts)
	for(var i = 0; i < nTufts; i++){
		var position	= new THREE.Vector3()
		position.x	= (Math.random()-0.5)*20
		position.z	= (Math.random()-0.5)*20
		positions[i]	= position
	}
	var mesh	= THREEx.createGrassTufts(positions)
	this.wrapper.add(mesh)

	// load the texture
	var textureUrl		= THREEx.createGrassTufts.baseUrl+'images/grass02.png'
	var material		= mesh.material
	material.map		= THREE.ImageUtils.loadTexture(textureUrl)
	material.alphaTest	= 0.7
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var nTufts	= 100
	var positions	= new Array(nTufts)
	for(var i = 0; i < nTufts; i++){
		var position	= new THREE.Vector3()
		position.x	= (Math.random()-0.5)*20
		position.z	= (Math.random()-0.5)*20
		positions[i]	= position
	}
	var mesh	= THREEx.createGrassTufts(positions)
	this.wrapper.add(mesh)

	// load the texture
	var material		= mesh.material
	var textureUrl		= THREEx.createGrassTufts.baseUrl+'images/flowers01.png'
	material.map		= THREE.ImageUtils.loadTexture(textureUrl)
	material.emissive.set(0x888888)
	material.alphaTest	= 0.7
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var nTufts	= 100
	var positions	= new Array(nTufts)
	for(var i = 0; i < nTufts; i++){
		var position	= new THREE.Vector3()
		position.x	= (Math.random()-0.5)*20
		position.z	= (Math.random()-0.5)*20
		positions[i]	= position
	}
	var mesh	= THREEx.createGrassTufts(positions)
	this.wrapper.add(mesh)

	// load the texture
	var material		= mesh.material
	var textureUrl		= THREEx.createGrassTufts.baseUrl+'images/flowers02.png'
	material.map		= THREE.ImageUtils.loadTexture(textureUrl)
	material.emissive.set(0x888888)
	material.alphaTest	= 0.7

	this.applyJSON();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Grass");