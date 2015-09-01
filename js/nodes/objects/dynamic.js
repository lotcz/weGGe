weggeDynamicObjects.prototype = new weggeObject();
weggeDynamicObjects.prototype.constructor = weggeDynamicObjects; 

function weggeDynamicObjects() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--dynamic-objects--";
	this.json.type = "DynamicObjects";

}	
	
weggeDynamicObjects.prototype.initialize = function(resources) {
	if (resources) {
		this.resources = resources;
	}
	if (WEGGE_CREATOR_MODE) {
		this.initializeChildren(this.resources);
	}	
	this.initialized = true;
	this.applyJSON();
	return this.wrapper;	
}

weggeDynamicObjects.prototype.create = function(position, life) {
	if (this.wrapper.children.length < 25) {
		for (var i = 0,max = this.children.length; i < max; i++) {
			var obj = this.createNode(this.children[i].json);		
			obj.json.position = _vectorToArray(position);
			var w = obj.initialize(this.resources);
			w.initialLife = _coalesce(life,100);
			w.life = w.initialLife;
			w.initialScale = _v(w.scale);
			this.wrapper.add(w);
		}
	}
}

weggeDynamicObjects.prototype.animationFrame = function(delta) {
	if (!WEGGE_CREATOR_MODE) {
		var obj, to_remove = [];
		
		for (var i = 0,max = this.wrapper.children.length; i < max; i++) {		
			obj = this.wrapper.children[i];
			obj.life = obj.life - delta;
			if (obj.life < (obj.initialLife/2)) {
				to_remove.push(obj);
			} else {
				var state = Math.pow(obj.life / obj.initialLife,3);
				obj.scale.set(
					state * obj.initialScale.x,
					state * obj.initialScale.y,
					state * obj.initialScale.z				
				);
				//obj.material.opacity.set(state,state,state);
			}
		}
		
		for (var i = 0,max = to_remove.length; i < max; i++) {
			_remove(this.wrapper.children,to_remove[i]);
		}
	}
}

weggeNode.prototype.availableTypes.push("DynamicObjects");