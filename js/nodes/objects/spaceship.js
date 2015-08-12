weggeSpaceship.prototype = new weggeObject();
weggeSpaceship.prototype.constructor = weggeSpaceship; 

function weggeSpaceship() {
	this.base = weggeObject;
	this.base();
	
	this.json.name = "--spaceship--";
	this.json.type = "Spaceship";
	this.json.ship_type = 0;
}

weggeSpaceship.prototype.addSpaceship = function(ship) {
    this.wrapper.add(ship);
}

weggeSpaceship.prototype.initialize = function() {

	switch (parseInt(this.json.ship_type)) {
		case 0 : THREEx.SpaceShips.loadSpaceFighter01(_bind(this, this.addSpaceship));
			break;
		case 1 : THREEx.SpaceShips.loadSpaceFighter02(_bind(this, this.addSpaceship));
			break;
		case 2 : THREEx.SpaceShips.loadSpaceFighter03(_bind(this, this.addSpaceship));
			break;
		case 3 : THREEx.SpaceShips.loadShuttle01(_bind(this, this.addSpaceship));
			break;
		case 4 : THREEx.SpaceShips.loadShuttle02(_bind(this, this.addSpaceship));
			break;
		case 5 : this.addSpaceship(THREEx.SpaceShips.Shoot());
			break;
		case 6 : this.addSpaceship(THREEx.SpaceShips.Detonation());
			break;
		default : THREEx.SpaceShips.loadSpaceFighter01(_bind(this, this.addSpaceship));			
	}
	
	this.applyBasic();
	return this.wrapper;
}

weggeNode.prototype.availableTypes.push("Spaceship");