function weggeControls( params ) {

	this.camera = params.camera;
	this.element = _coalesce( params.element, document );
	this.movementSpeed = _coalesce( params.movementSpeed, 7000 );	
	this.vertSpeed = _coalesce( params.vertSpeed, 0.1 );
	this.horizSpeed = _coalesce( params.horizSpeed, 0.1 );
	this.vertMin = _coalesce( params.vertMin, -15 );
	this.vertMax = _coalesce( params.vertMax, 15 );
	this.horizMin = _coalesce( params.horizMin, -45 );
	this.horizMax = _coalesce( params.horizMax, 45 );
	
	this.movementEnabled = true;
	this.movementSpeed = _coalesce( params.movementSpeed, 7000 );	
	this.limitMovementMinY = 150; // set to zero to disable
			
	this.target = new THREE.Vector3( 0, 0, 0 );
	this.viewHalfX = 0;
	this.viewHalfY = 0;
	this.mouseX = 0;
	this.mouseY = 0;
	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;
	
	this.initialize = function(camera, lat, lon) {
		this.camera = camera;
		if (this.camera) {
			this.lat = _coalesce(lat, 0);
			this.lon = _coalesce(lon, 0);
			this.phi = THREE.Math.degToRad( 90 - this.lat );
			this.theta = THREE.Math.degToRad( this.lon );
			this.target.x = this.camera.position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			this.target.y = this.camera.position.y + 100 * Math.cos( this.phi );
			this.target.z = this.camera.position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );
			this.camera.lookAt( this.target );	
		}
	}
	
	this.reset = this.initialize;
	
	this.onWindowResize = function () {
		if ( this.element === document ) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.element.offsetWidth / 2;
			this.viewHalfY = this.element.offsetHeight / 2;
		}
	}
	
	this.onMouseMove = function( event ) {
		if (this.lookEnabled) {
			if ( this.element === document ) {
				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;
			} else {
				this.mouseX = event.pageX - this.element.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.element.offsetTop - this.viewHalfY;
			}
		}
	}
	
	this.onKeyDown = function ( event ) {
		if (this.movementEnabled) {
			//event.preventDefault();
			switch ( event.keyCode ) {
				case 38: /*up*/
				case 87: /*W*/ this.moveForward = true; break;
				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = true; break;
				case 40: /*down*/
				case 83: /*S*/ this.moveBackward = true; break;
				case 39: /*right*/
				case 68: /*D*/ this.moveRight = true; break;
				case 82: /*R*/ this.moveUp = true; break;
				case 70: /*F*/ this.moveDown = true; break;
			}
		}
	};

	this.onKeyUp = function ( e ) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		//console.log("key:" + key);
		if (this.movementEnabled) {
			switch( key ) {
				case 38: /*up*/
				case 87: /*W*/ this.moveForward = false; break;
				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = false; break;
				case 40: /*down*/
				case 83: /*S*/ this.moveBackward = false; break;
				case 39: /*right*/
				case 68: /*D*/ this.moveRight = false; break;
				case 82: /*R*/ this.moveUp = false; break;
				case 70: /*F*/ this.moveDown = false; break;				
			}
		}
		
		switch( key ) {
			case 32: /* space */
			case 80: /*P*/ this.lookEnabled=!this.lookEnabled;break;
		}
	};

	this.animationFrame = function( delta ) {

		if (this.lookEnabled) {
			this.lat -= this.mouseY * this.vertSpeed * delta;
			if (this.vertLockEnabled) this.lat = Math.max( this.vertMin , Math.min( this.vertMax, this.lat ) );
			this.phi = THREE.Math.degToRad( 90 - this.lat );
		
			this.lon += this.mouseX * this.horizSpeed * delta;
			if (this.horizLockEnabled) this.lon = Math.max( this.horizMin , Math.min( this.horizMax, this.lon ) );
			this.theta = THREE.Math.degToRad( this.lon );

			this.target.x = this.camera.position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			this.target.y = this.camera.position.y + 100 * Math.cos( this.phi );
			this.target.z = this.camera.position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

			this.camera.lookAt( this.target );
		}
		
		if (this.movementEnabled) {
			var actualMoveSpeed = delta * this.movementSpeed;
			if ( this.moveForward ) this.camera.translateZ( - actualMoveSpeed );
			if ( this.moveBackward ) this.camera.translateZ( actualMoveSpeed );
			if ( this.moveLeft ) this.camera.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.camera.translateX( actualMoveSpeed );
			if ( this.moveUp ) this.camera.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.camera.translateY( - actualMoveSpeed );
			if ( this.limitMovementMinY && ( this.camera.position.y < this.limitMovementMinY ) ) {
				this.camera.position.y = this.limitMovementMinY;
			}
		}
	
	}
		
	this.resetToDefault = function() {		
		this.lookEnabled = true;
		this.movementEnabled = true;
		this.horizLockEnabled = false;		
		this.vertLockEnabled = true;
		this.limitMovementMinY = 0;
		this.horizSpeed = 0.3;
		this.horizSpeed = 0.3;
		this.vertMin = -85;
		this.vertMax = 85;
	}
	
	this.disableMovement = function () {
		this.movementEnabled = false;
		this.moveForward = false; 
		this.moveLeft = false;
		this.moveBackward = false; 
		this.moveRight = false;
		this.moveUp = false; 
		this.moveDown = false;
	}
	
	window.addEventListener( 'resize', _bind( this, this.onWindowResize) , false );	
	this.element.addEventListener( 'keydown', _bind( this, this.onKeyDown) , false );	
	this.element.addEventListener( 'keyup', _bind( this, this.onKeyUp ), false );
	this.element.addEventListener( 'mousemove', _bind( this, this.onMouseMove ), false );
	
	this.onWindowResize();
		
}