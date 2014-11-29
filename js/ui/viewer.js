function weggeViewer() {
	
	this.level = false;
	this.resources = false;
	this.host3D = false;
	this.controls = false;
	
	this.initHost3D = function() {
		if (!this.host3D) {
			this.host3D = new weggeHost3D();
		}
		
		this.host3D.onAnimationFrame = _bind(this, this.animationFrame);
		
		if (this.level) {			
			this.host3D.renderer.setClearColor( _coalesce(this.level.json.clearColor, 0x101010) );
			if (this.level.json.ambientLight) {				
				this.host3D.scene.add(new THREE.AmbientLight(this.level.json.ambientLight));
			}
			var level_object = this.level.initialize(this.resources);
			if (level_object) {
				this.host3D.scene.add(level_object);
			}
			
			if (!this.controls) {
				this.controls = new weggeControls({ element: document });
				this.controls.resetToDefault();
				this.controls.movementSpeed = 500;
				this.controls.lookEnabled = false;
				this.controls.movementEnabled = true;				
			}
			this.controls.initialize( this.host3D.camera, this.level.json.cameraLatitude, this.level.json.cameraLongitude );
			this.host3D.camera.position.set(this.level.json.cameraPosition[0],this.level.json.cameraPosition[1],this.level.json.cameraPosition[2]);
		}	
	}	
	
	this.resetHost3D = function () {
		this.controls.camera = false;
		if (this.host3D) {
			this.host3D.destroy();
			this.host3D = false;
		}
	}
	
	this.levelLoaded = function( data ) { 
		//console.log("level loaded:");
		//console.log(data);
		this.level = new weggeLevel();
		this.level.loadFromJSON(data.level_id, data.level_json);
		var res = this.level.getRequiredResources();
		if ((res.length > 0) && (!this.resources)) {
			this.loadResources(res.join());
		} else {
			this.start();
		}			
	}
	
	this.startLoadingLevel = function( level_id ) {
		this.resetHost3D();
		this.resources = false;
		$.get("php/loadLevel.php",
			{level_id: level_id},
			_bind(this, this.levelLoaded)
		);		
	}

	this.reloadLevel = function() {		
		this.startLoadingLevel(this.level.id);
	}
	
	this.animationFrame = function(delta) {
		this.controls.animationFrame(delta);
		this.level.animationFrame(delta);
	}
	
	this.start = function() {
		this.host3D.scene.add(this.level.initialize(this.resources));
		this.host3D.onAnimationFrame = _bind(this, this.animationFrame);
		this.controls = new weggeControls({ "camera":this.host3D.camera, element: document });
		this.controls.resetToDefault();
		this.controls.movementSpeed = 500;
		this.controls.lookEnabled = this.controls.movementEnabled = true;
		this.host3D.startAnimation();
	}

	/* RESOURCES */
	
	this.resourcesLoaded = function( resources_json ) { 
		this.resources = new weggeResources();
		this.resources.loadFromJSON( resources_json );
		this.resources.onInitialized = _bind(this, this.start);
		this.resources.initialize();
	}		
	
	this.loadResources = function(ids) {
		$.get("php/loadResources.php", 
			{ids:_coalesce(ids,'')},
			_bind(this, this.resourcesLoaded)
		);
	}
					
}



