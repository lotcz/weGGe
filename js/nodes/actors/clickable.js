weggeClickableActor.prototype = new weggeActor();
weggeClickableActor.prototype.constructor = weggeClickableActor; 

function weggeClickableActor() {
	this.base = weggeActor;
	this.base();	
	
	this.json.type = "ClickableActor";
	this.json.name = "--clickable actor--";	
	this.json.click_actor_name = "";
	this.json.click_actor_action = "";
	this.json.click_actor_args = "";
	this.click_actor = null;
}

weggeClickableActor.prototype.initActor = function(level) {
	if (this.json.target_name.length > 0) {
		this.target = level.findNodeByName(this.json.target_name);
	}
	if (this.target && this.target.wrapper) {
		this.target.wrapper.clickable = true;
		this.target.wrapper.onClick = _bind(this,this.click);
	}
	if (this.json.click_actor_name.length > 0) {
		this.click_actor = level.findNodeByName(this.json.click_actor_name);
	}
	
}

weggeClickableActor.prototype.click = function( ) {
	if (this.click_actor !== null && this.click_actor.act) {
		this.click_actor.act( this.json.click_actor_action, this.json.click_actor_args );
	}
}

weggeNode.prototype.availableTypes.push("ClickableActor");