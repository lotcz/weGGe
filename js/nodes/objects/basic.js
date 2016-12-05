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
	this.json.physics = 1;
	this.json.material_resource_id = 0;
	
}

weggeSphere.prototype.initialize = function(resources) {
	var geometry = new THREE.SphereGeometry(this.json.radius, this.json.widthSegments, this.json.heightSegments);
	var color = new THREE.Color();
	color.setStyle(this.json.color);
	
	var material = null;
	
	if (resources) {
		var res = resources.getById(this.json.material_resource_id);
		if (res && res.material) {
			material = res.material;
		}
	}
	
	if (material === null) {
		material = new THREE.MeshPhongMaterial({color:color});
	}
	
	if (this.json.physics > 0) {
		var phy_material = Physijs.createMaterial(
			material,
			.6, // friction
			1 // bounciness
		);		
		this.wrapper = new Physijs.SphereMesh(
			geometry,
			phy_material,
			this.json.mass
		);
		
	} else {
		this.wrapper = new THREE.Mesh( geometry, material );
	}
	this.applyBasic();
	return this.wrapper;
}

weggeSphere.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
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
	this.json.material_resource_id = 0;
	this.json.color = "#FF5050";
}

weggeBox.prototype.initialize = function(resources) {
	var geometry = new THREE.BoxGeometry( this.json.width, this.json.height, this.json.depth );
	var material = null;
	
	if (resources) {
		var res = resources.getById( this.json.material_resource_id );
		if (res && res.material) {
			material = res.material;
		} else {
			console.log("Material not found:" + this.json.material_resource_id );
		}
	}
	
	if (material === null) {
		var color = new THREE.Color();
		color.setStyle(this.json.color);
		material = new THREE.MeshBasicMaterial({color:color});
		if (_b(this.json.physics)) {	
			material = Physijs.createMaterial(material, 1, 1);
		}
	}
	
	if (material !== null) {
		if (_b(this.json.physics)) {			
			this.wrapper = new Physijs.BoxMesh(
				geometry,
				material,
				this.json.mass
			);			
		} else {		
			this.wrapper = new THREE.Mesh( geometry, material );
		}
	} else {
		console.log("Material couldn't be initialized.");
	}
		
	this.applyBasic();
	return this.wrapper;
}

weggeBox.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Box");

weggeCylinder.prototype = new weggeObject();
weggeCylinder.prototype.constructor = weggeCylinder; 

function weggeCylinder() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--Cylinder--";
	this.json.type = "Cylinder";
	this.json.radiusTop = 20;
	this.json.radiusBottom = 20;
	this.json.height = 100;
	this.json.radiusSegments = 8;
	this.json.heightSegments = 1;
	this.json.openEnded = 0;
	//this.json.thetaStart = 100;
	//this.json.thetaLength = 100;
	this.json.material_resource_id = "basic_material";
	this.json.color = "#FF5050";
}

weggeCylinder.prototype.initialize = function(resources) {
	/*
	CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)

	radiusTop — Radius of the cylinder at the top. Default is 20.
	radiusBottom — Radius of the cylinder at the bottom. Default is 20.
	height — Height of the cylinder. Default is 100.
	radiusSegments — Number of segmented faces around the circumference of the cylinder. Default is 8
	heightSegments — Number of rows of faces along the height of the cylinder. Default is 1.
	openEnded — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
	thetaStart — Start angle for first segment, default = 0 (three o'clock position).
	thetaLength — The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
	*/
	var geometry = new THREE.CylinderGeometry( parseInt(this.json.radiusTop), parseInt(this.json.radiusBottom), parseInt(this.json.height), parseInt(this.json.radiusSegments), parseInt(this.json.heightSegments), _b(this.json.openEnded) );
	var material = null;
	
	if (resources) {
		var res = resources.getById( this.json.material_resource_id );
		if (res && res.material) {
			material = res.material;
		} else {
			console.log("Material not found:" + this.json.material_resource_id );
		}
	}
	
	if (material === null) {
		var color = new THREE.Color();
		color.setStyle(this.json.color);
		material = new THREE.MeshLambertMaterial({color:color,ambient:color});
	}
	
	if (material !== null) {
		if (this.json.physics > 0) {
			var phy_material = Physijs.createMaterial(
				material,
				.6, // medium friction
				.7 // low restitution
			);		
			this.wrapper = new Physijs.CylinderMesh(
				geometry,
				phy_material,
				this.json.mass
			);	
		} else {		
			this.wrapper = new THREE.Mesh( geometry, material );
		}
	} else {
		console.log("Material couldn't be initialized.");
	}
		
	this.applyBasic();
	return this.wrapper;
}

weggeCylinder.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Cylinder");
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
	
	this.json.name = "text";
	this.json.type = "Text3D";
	this.json.text = "T.E.X.T";
	this.json.size = 100; // Float. Size of the text.
	this.json.height = 50; // Float. Thickness to extrude text. Default is 50.
	this.json.curveSegments = 10; // Integer. Number of points on the curves.
	this.json.font = "helvetiker"; // Font resource name. Convertor: http://gero3.github.io/facetype.js/
	this.json.weight = "normal"; // String. Font weight (normal, bold).
	this.json.style = "normal"; // String. Font style (normal, italics).
	this.json.bevelEnabled = false; // Boolean. Turn on bevel. Default is False.
	this.json.bevelThickness = 10; // Float. How deep into text bevel goes. Default is 10.
	this.json.bevelSize = 8; // Float. How far from text outline is bevel. Default is 8.

	this.json.color = "#FF5050";
}

weggeText3D.prototype.initialize = function(resources) {
	var font = false;
	
	if (resources) {
		var res = resources.getById( this.json.font );
		if (res && res.font) {
			font = res.font;
		} else {
			console.log("Font not found:" + this.json.font );
		}
	}
	
	if (font) {	
		try {
			var geometry = new THREE.TextGeometry( this.json.text, 
				{ 
					size: this.json.size, 
					height: this.json.height,
					curveSegments: this.json.curveSegments, 
					font: font,
					bevelThickness: parseInt(this.json.bevelThickness),
					bevelSize: parseInt(this.json.bevelSize),
					bevelEnabled: _b(this.json.bevelEnabled),
				} 
			);
			
			var color = new THREE.Color();
			color.setStyle(this.json.color);		
			var material = new THREE.MeshPhongMaterial({color:color});
			
			if (this.json.physics > 0) {
				var phy_material = Physijs.createMaterial(
					material,
					.6, // medium friction
					.1 // low restitution
				);		
				this.wrapper = new Physijs.ConvexMesh(
					geometry,
					phy_material,
					this.json.mass
				);	
			} else {
				this.wrapper = new THREE.Mesh( geometry, material);
			}
			
			this.wrapper.castShadow = true;
			this.wrapper.receiveShadow = true;
					
			this.applyBasic();
			return this.wrapper;
		} catch (e) {		
			console.log(e);
		}
	}
}

weggeNode.prototype.availableTypes.push("Text3D");

weggeTube.prototype = new weggeObject();
weggeTube.prototype.constructor = weggeTube; 

function weggeTube() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "tube_spiral";
	this.json.type = "Tube";
	this.json.color = "#FF5050";
	this.json.material_resource_id = "basic_material";
	this.json.segments = 20; 
	this.json.radius = 2;
	this.json.radiusSegments = 8;
	this.json.closed = false;	
}

var CustomSinCurve = THREE.Curve.create(
	function ( scale ) { //custom curve constructor
		this.scale = (scale === undefined) ? 1 : scale;
	},
	
	function ( t ) { //getPoint: t is between 0-1
		var tx = t * 100,
			ty = Math.sin( 100 * ( Math.PI * t) ),
			tz = Math.sin( (100 * ( Math.PI * t)) - (Math.PI/2) );
		
		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
	}
);

weggeTube.prototype.initialize = function(resources) {
		
	var material = null;
	
	if (resources) {
		var res = resources.getById( this.json.material_resource_id );
		if (res && res.material) {
			material = res.material;
		} else {
			console.log("Material not found:" + this.json.material_resource_id );
		}
	}
	
	if (material === null) {
		var color = new THREE.Color();
		color.setStyle(this.json.color);
		material = new THREE.MeshBasicMaterial({color:color});		
	}
	
	var curve = new CustomSinCurve( 10 );
	
	var geometry = new THREE.TubeGeometry(
		curve,  //path
		parseInt(this.json.segments),
		parseFloat(this.json.radius),
		parseInt(this.json.radiusSegments),
		_b(this.json.closed)
	);

	this.wrapper = new THREE.Mesh( geometry, material );
	
	this.applyBasic();
	return this.wrapper;
}

weggeTube.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Tube");
