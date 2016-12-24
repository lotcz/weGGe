weggeAmbientLight.prototype = new weggeObject();
weggeAmbientLight.prototype.constructor = weggeAmbientLight; 

function weggeAmbientLight() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--ambient light--";
	this.json.type = "AmbientLight";
	this.json.color = "#A0A0A0";
}

weggeAmbientLight.prototype.applyJSON = function() {
	this.applyBasic();
	if (this.wrapper.color) {
		this.wrapper.color.setStyle(this.json.color);	
	}
}

weggeAmbientLight.prototype.initialize = function() {
	this.wrapper = new THREE.AmbientLight();
	this.applyJSON();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("AmbientLight");

weggeDirectionalLight.prototype = new weggeObject();
weggeDirectionalLight.prototype.constructor = weggeDirectionalLight; 

function weggeDirectionalLight() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--directional light--";
	this.json.type = "DirectionalLight";
	this.json.intensity = 0.5;
	this.json.color = "#A0A0A0";
}

weggeDirectionalLight.prototype.applyJSON = function() {
	this.applyBasic();
	this.wrapper.color.setStyle(this.json.color);
	this.wrapper.intensity = this.json.intensity;
}

weggeDirectionalLight.prototype.initialize = function() {
	this.wrapper = new THREE.DirectionalLight();
	this.applyJSON();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("DirectionalLight");

weggePointLight.prototype = new weggeObject();
weggePointLight.prototype.constructor = weggePointLight; 

function weggePointLight() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--point light--";
	this.json.type = "PointLight";
	this.json.intensity = 0.5;
	this.json.distance = 500;
	this.json.color = "#FF5050";
}

weggePointLight.prototype.applyJSON = function() {
	this.applyBasic();
	this.wrapper.color.setStyle(this.json.color);
	this.wrapper.intensity = this.json.intensity;
	this.wrapper.distance = this.json.distance;
	if (this.helper) {
		this.helper.update();
	}
}

weggePointLight.prototype.initialize = function() {
	this.wrapper = new THREE.PointLight();
	if (WEGGE_CREATOR_MODE) {		
		this.helper = new THREE.PointLightHelper(this.wrapper, 10);
		WEGGE_CREATOR_HELPERS.push(this.helper);
	}
	this.applyJSON();
	return this.wrapper;
}

weggePointLight.prototype.availableTypes.push("PointLight");

weggeSpotLight.prototype = new weggeObject();
weggeSpotLight.prototype.constructor = weggeSpotLight; 

function weggeSpotLight() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--spot light--";
	this.json.type = "SpotLight";
	
	this.json.intensity = 0.5;
	this.json.distance = 500;
	this.json.angle = Math.PI/3;
	this.json.penumbra = 0.3;
	this.json.exponent = 10;
	this.json.color = "#FF5050";
		
	this.json.castShadow = true;
	this.json.shadowMapWidth = 1024;
	this.json.shadowMapHeight = 1024;
	this.json.shadowCameraNear = 10;
	//this.json.shadowCameraFar = this.json.distance;
	this.json.shadowCameraFov = 30;
	
	this.light = false;
}

weggeSpotLight.prototype.applyJSON = function() {
	this.applyBasic();
	this.light.color.setStyle(this.json.color);
	this.light.intensity = parseFloat(this.json.intensity);
	this.light.distance = parseInt(this.json.distance);
	this.light.angle = parseFloat(this.json.angle);
	this.light.exponent = parseFloat(this.json.exponent);

	this.light.castShadow = _b(this.json.castShadow);
	this.light.shadow.mapSize.width = parseInt(this.json.shadowMapWidth);
	this.light.shadow.mapSize.height = parseInt(this.json.shadowMapHeight);
	this.light.shadow.camera.near = parseInt(this.json.shadowCameraNear);
	this.light.shadow.camera.far = this.light.distance ; //parseInt(this.json.shadowCameraFar);
	this.light.shadow.camera.fov = parseInt(this.json.shadowCameraFov);
	
	if (this.helper) {
		this.helper.update();
	}
}

weggeSpotLight.prototype.initialize = function() {
	this.light = new THREE.SpotLight(_getColorHex(this.json.color));
	this.target = new THREE.Object3D();
	this.light.target = this.target;
	this.applyJSON();
	this.wrapper.add(this.light);
	this.wrapper.add(this.target);	
	if (WEGGE_CREATOR_MODE) {		
		this.helper = new THREE.SpotLightHelper(this.light);
		WEGGE_CREATOR_HELPERS.push(this.helper);
	}
	
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("SpotLight");

weggeVolumetricSpotLight.prototype = new weggeObject();
weggeVolumetricSpotLight.prototype.constructor = weggeVolumetricSpotLight; 

function weggeVolumetricSpotLight() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--volumetric--";
	this.json.type = "VolumetricSpotLight";
	
	this.json.intensity = 0.5;
	this.json.distance = 500;
	this.json.angle = Math.PI/3;
	this.json.exponent = 10;
	this.json.color = "#FF5050";
		
	this.json.castShadow = false;
	this.json.shadowMapWidth = 1024;
	this.json.shadowMapHeight = 1024;
	this.json.shadowCameraNear = 500;
	this.json.shadowCameraFar = 4000;
	this.json.shadowCameraFov = 30;
	
	this.light = false;
}

weggeVolumetricSpotLight.prototype.applyJSON = function() {
	this.applyBasic();
	this.light.color.setStyle(this.json.color);
	this.light.intensity = this.json.intensity;
	this.light.distance = this.json.distance;
	this.light.angle = this.json.angle;
	this.light.exponent = this.json.exponent;
	this.light.castShadow = this.json.castShadow;
	this.light.shadowMapWidth = this.json.shadowMapWidth;
	this.light.shadowMapHeight = this.json.shadowMapHeight;
	this.light.shadowCameraNear = this.json.shadowCameraNear;
	this.light.shadowCameraFar = this.json.shadowCameraFar;
	this.light.shadowCameraFov = this.json.shadowCameraFov;
	
	if (this.helper) {
		this.helper.update();
	}
}

weggeVolumetricSpotLight.prototype.animationFrame = function(delta) {
	//this.spotlightMesh.syncLight(this.light);
	//this.spotlightMesh.update();	
}
		
weggeVolumetricSpotLight.prototype.initialize = function() {
	this.light = new THREE.SpotLight(_getColorHex(this.json.color));
	this.target = new THREE.Object3D();
	this.target.position.set(0,-1,0);
	this.light.target = this.target;
	this.wrapper.add(this.light);
	this.wrapper.add(this.target);	
	/*
	var geometry= new THREE.CylinderGeometry(0.0, 1.5, 5, 32*2, 20, true);
	var material	= new THREE.MeshLambertMaterial({color:0xFFFFFF});//new THREEx.VolumetricSpotLightMaterial()
	var object3d	= new THREE.Mesh( geometry, material );
	this.wrapper.add(object3d);
	*/
	
	this.spotlightMesh = new THREEx.VolumetricSpotlightMesh();
	this.spotlightMesh.object3d.position = this.wrapper.position;
	//this.spotlightMesh.object3d.scale.set(100,100,100);
	this.wrapper.add(this.spotlightMesh.object3d);
	
	if (WEGGE_CREATOR_MODE) {		
		this.helper = new THREE.SpotLightHelper(this.light);
		WEGGE_CREATOR_HELPERS.push(this.helper);
		//WEGGE_CREATOR_HELPERS.push(this.spotlightMesh.object3d);
	}
	this.applyJSON();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("VolumetricSpotLight");