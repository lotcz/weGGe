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
	this.wrapper.color.setStyle(this.json.color);
	//this.applyBasic();
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
}

weggePointLight.prototype.initialize = function() {
	this.wrapper = new THREE.PointLight();
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
	this.json.exponent = 10;
	this.json.color = "#FF5050";
		
	this.json.castShadow = false;
	this.json.shadowMapWidth = 1024;
	this.json.shadowMapHeight = 1024;
	this.json.shadowCameraNear = 500;
	this.json.shadowCameraFar = 4000;
	this.json.shadowCameraFov = 30;	
}

weggeSpotLight.prototype.applyJSON = function() {
	this.applyBasic();
	this.wrapper.color.setStyle(this.json.color);
	this.wrapper.intensity = this.json.intensity;
	this.wrapper.distance = this.json.distance;
	this.wrapper.angle = this.json.angle;
	this.wrapper.exponent = this.json.exponent;
	this.wrapper.castShadow = this.json.castShadow;
	this.wrapper.shadowMapWidth = this.json.shadowMapWidth;
	this.wrapper.shadowMapHeight = this.json.shadowMapHeight;
	this.wrapper.shadowCameraNear = this.json.shadowCameraNear;
	this.wrapper.shadowCameraFar = this.json.shadowCameraFar;
	this.wrapper.shadowCameraFov = this.json.shadowCameraFov;
}

weggeSpotLight.prototype.initialize = function() {
	this.wrapper = new THREE.SpotLight(_getColorHex(this.json.color));
	this.applyJSON();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("SpotLight");