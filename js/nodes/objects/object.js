weggeObject.prototype = new weggeNode();
weggeObject.prototype.constructor = weggeNode; 

function weggeObject() {

}

/* call this.initializeChildren(resources) to initialize all children from resources */
weggeObject.prototype.initializeChildren = function ( resources ) {
	var child_wrapper;
	for ( var i = 0, max = this.children.length; i < max; i++) {
		child_wrapper = this.children[i].initialize(resources);
		if (child_wrapper) {
			if (!this.wrapper) {
				this.wrapper = new THREE.Object3D();
			}
			this.wrapper.add(child_wrapper);
		}
	}
}

weggeObject.prototype.getChildrenRequiredResources = function() {
	var required = [];
	for ( var i = 0, max = this.children.length; i < max; i++) {
		_appendIfNotExist(required, this.children[i].getRequiredResources());
	}
	return required;
}

/* animates all children */
weggeObject.prototype.childrenAnimationFrame = function(delta) {
	for ( var i = 0, max = this.children.length; i < max; i++) {
		this.children[i].animationFrame(delta);
	}
}

/* CAN OVERRIDE */

weggeObject.prototype.initialize = function ( resources ) {
	/* add node's type initialization */
		//this.wrapper = new THREE.Object3D();
	/**/
	
	this.initializeChildren(resources);
	return this.wrapper;
}

weggeObject.prototype.animationFrame = function(delta) {
	/* perform animation */

	/**/
	
	this.childrenAnimationFrame(delta);
}

weggeObject.prototype.getRequiredResources = function() {
	var required = [];
	/* add node's specific resources here */ 
	
	/**/
	_appendIfNotExist(required, this.getChildrenRequiredResources());
	return required;
}

weggeNode.prototype.availableTypes.push("Object");