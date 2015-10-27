weggeSprite.prototype = new weggeObject();
weggeSprite.prototype.constructor = weggeSprite; 

function weggeSprite() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "sprite";
	this.json.type = "Sprite";
	this.json.material_resource_id = "material_name";
}

weggeSprite.prototype.initialize = function ( resources ) {
	var material;
	
	if (resources) {
		var res = resources.getById( this.json.material_resource_id );
		if (res && res.material) {
			material = res.material;
		} else {
			console.log("Material not found:" + this.json.material_resource_id );
		}
	}
	
	if (material) {
		this.wrapper = new THREE.Sprite( material );
	}
		
	this.applyBasic();
	return this.wrapper;	
}

weggeSprite.prototype.getRequiredResources = function() {
	return [this.json.material_resource_id];
}

weggeNode.prototype.availableTypes.push("Sprite");

weggeTextSprite.prototype = new weggeObject();
weggeTextSprite.prototype.constructor = weggeTextSprite; 

function weggeTextSprite() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "text_sprite";
	this.json.type = "TextSprite";
	this.json.text = "text sprite text";
	this.json.fontFace = "Arial";
	this.json.fontSize = 18;
	this.json.fontColor = "rgba(255,200,255,1.0)";
	this.json.borderThickness = 4;
	this.json.borderRadius = 10;
	this.json.borderColor = "rgba(100,100,100,1.0)";
	this.json.backgroundColor = "rgba(50,50,55,0.5)"
}

weggeTextSprite.prototype.initialize = function ( resources ) {
	var material;
	
	this.json.fontSize = parseInt(this.json.fontSize);
	this.json.borderThickness = parseInt(this.json.borderThickness);
	this.json.borderRadius = parseInt(this.json.borderRadius);
	
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + this.json.fontSize + "px " + this.json.fontFace;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( this.json.text );
	var textWidth = metrics.width ;
	
	context.fillStyle = this.json.backgroundColor;
	context.strokeStyle = this.json.borderColor;

	context.lineWidth = this.json.borderThickness;
	this.roundRect(context, this.json.borderThickness/2, this.json.borderThickness/2, textWidth + this.json.borderThickness * 2, this.json.fontSize * 1.4 + this.json.borderThickness, this.json.borderRadius);

	context.fillStyle = this.json.fontColor;
	context.fillText( this.json.text, this.json.borderThickness, this.json.fontSize + this.json.borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
	this.wrapper = new THREE.Sprite( spriteMaterial );
		
	this.applyBasic();
	return this.wrapper;	
}

weggeTextSprite.prototype.roundRect = function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

weggeNode.prototype.availableTypes.push("TextSprite");