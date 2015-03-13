weggeSphere.prototype = new weggeObject();
weggeSphere.prototype.constructor = weggeSphere; 

function weggeSphere() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--sphere--";
	this.json.type = "Sphere";
	this.json.radius = 100;
	this.json.widthSegments = 10;
	this.json.heightSegment = 10;
	this.json.color = "#FF5050";
}

weggeSphere.prototype.initialize = function() {
	var geometry = new THREE.SphereGeometry(this.json.radius, this.json.widthSegments, this.json.heightSegments);
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:color,ambient:color}) );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Sphere");

weggeBox.prototype = new weggeObject();
weggeBox.prototype.constructor = weggeBox; 

function weggeBox() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--box--";
	this.json.type = "Box";
	this.json.width = 100;
	this.json.height = 100;
	this.json.depth = 100;
	this.json.color = "#FF5050";
}

weggeBox.prototype.initialize = function() {
	var geometry = new THREE.BoxGeometry( this.json.width, this.json.height, this.json.depth );
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:color,ambient:color}) );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Box");

weggeRing.prototype = new weggeObject();
weggeRing.prototype.constructor = weggeRing; 

function weggeRing() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--ring--";
	this.json.type = "Ring";
	this.json.innerRadius = 10;
	this.json.outerRadius = 15;
	this.json.thetaSegments = 32;
	this.json.phiSegments = 8;
	this.json.thetaStart = 0;
	this.json.thetaLength = Math.PI * 2;

	this.json.color = "#FF5050";
}

weggeRing.prototype.initialize = function() {
	var geometry = new THREE.RingGeometry( this.json.innerRadius, this.json.outerRadius, this.json.thetaSegments, this.json.phiSegments, this.json.thetaStart, this.json.thetaLength );
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color:color, ambient:color}) );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Ring");

weggeText3D.prototype = new weggeObject();
weggeText3D.prototype.constructor = weggeText3D; 

function weggeText3D() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--text 3D--";
	this.json.type = "Text3D";
	this.json.text = "T.E.X.T";
	this.json.size = 100; // Float. Size of the text.
	this.json.height = 50; // Float. Thickness to extrude text. Default is 50.
	this.json.curveSegments = 10; // Integer. Number of points on the curves.
	this.json.font = "helvetiker"; // String. Font name.
	this.json.weight = "normal"; // String. Font weight (normal, bold).
	this.json.style = "normal"; // String. Font style (normal, italics).
	this.json.bevelEnabled = false; // Boolean. Turn on bevel. Default is False.
	this.json.bevelThickness = 10; // Float. How deep into text bevel goes. Default is 10.
	this.json.bevelSize = 8; // Float. How far from text outline is bevel. Default is 8.

	this.json.color = "#FF5050";
}

weggeText3D.prototype.initialize = function() {
	var geometry = new THREE.TextGeometry( this.json.text, 
		{ size: this.json.size, height: this.json.height,
			curveSegments: this.json.curveSegments, font: this.json.font } );
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	this.wrapper = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:color, ambient:color}) );
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Text3D");

