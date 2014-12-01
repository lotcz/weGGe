weggeSpaceship.prototype = new weggeObject();
weggeSpaceship.prototype.constructor = weggeSpaceship; 

function weggeSpaceship() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--spaceship--";
	this.json.type = "Spaceship";
}

weggeSpaceship.prototype.addSpaceship = function(ship) {
	ship.scale.set(1,1,1);
    this.wrapper.add(ship);
}

weggeSpaceship.prototype.initialize = function() {
	THREEx.SpaceShips.loadSpaceFighter01(_bind(this, this.addSpaceship));    
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Spaceship");