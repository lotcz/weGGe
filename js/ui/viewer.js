var WEGGE_CREATOR_MODE = false;

function weggeViewer( ) {
	
	this.level = false;
	this.resources = false;
	this.host3D = false;
	this.controls = false;
	
	this.keyboard = null;
	this.keyboardInput = true;
	
	this.mouse = null;
	this.mouseSelect = true;
	
	this.ui = new weggeUI();
	this.info = this.ui.addContainer().css({position:"absolute",bottom:"0px",right:"0px"}).hide();
	
	this.start = function() {
		if (this.level) {			
			this.resetHost3D();
			this.ui.showLoading("Starting...");
			this.host3D = new weggeHost3D();
			this.level.initialize(this.host3D, this.resources);
			this.host3D.onAnimationFrame = _bind(this, this.animationFrame);
			
			if (!this.controls) {
				this.controls = new weggeControls({ "camera":this.host3D.camera, element: document });
				this.controls.resetToDefault();
				this.controls.movementSpeed = 500;				
				this.controls.movementEnabled = true;
				this.controls.onControlsStateChanged = _bind(this, this.controlsStateChanged);
			}
			
			this.controls.initialize( this.host3D.camera, this.level.json.cameraLatitude, this.level.json.cameraLongitude );			
				
				
			if (this.mouse !== null) {
				this.mouse.destroy();
				this.mouse = null;
			}
			
			if (this.mouseSelect) {				
				this.mouse = new weggeMouse(this.level.selectable, this.host3D.camera);
			}
			
			if (this.keyboard !== null) {
				this.keyboard.destroy();
				this.keyboard = null;
			}
			
			if (this.keyboardInput) {				
				//this.keyboard = new weggeKeyboard(this.level.selectable, this.host3D);
			}
			
			/* start */
			if (!this.level.json.renderingPaused) {
				this.host3D.startRendering();
			}
			
			if (!this.level.json.animationPaused) {
				this.host3D.startAnimation();
			}
			
			if (!this.level.json.physicsPaused) {
				this.host3D.startPhysics();
			}
			
			this.ui.hideLoading();
			
			if (this.onLevelLoaded) {
				this.onLevelLoaded();
			}
		}
	}
	
	this.toggleRendering = function() {
		if (this.host3D) {
			this.host3D.toggleRendering();
		}
	}
	
	this.toggleAnimation = function() {
		if (this.host3D) {
			this.host3D.toggleAnimation();
		}
	}
	
	this.togglePhysics = function() {
		if (this.host3D) {
			this.host3D.togglePhysics();
		}
	}
	
	this.toggleLook = function() {
		if (this.controls) {
			this.controls.toggleLook();
		}
	}
	
	this.showInfo = function( text ) {
		this.info.html( text ).show();
	}
	
	this.hideInfo = function () {
		this.info.hide();
	}
	
	this.showInfo("ESC - select level to load.");
	
	this.resetUI = function() {		
		this.levelLoadCancel();		
		this.ui.removeOverlay();
	}
	
	this.resetHost3D = function () {
		this.controls.camera = false;
		if (this.host3D) {
			this.host3D.destroy();
			this.host3D = false;
		}
	}
	
	this.onKeyUp = function ( e ) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		//console.log("key:" + key);
		switch( key ) {
			case 27: /*ESC*/
				this.loadLevelList();
		}
	}
		
	this.levelLoaded = function( data ) { 
		this.ui.showLoading("Initializing...");
		if (data.level_id) {
			_createCookie("level",data.level_id);
			this.level = new weggeLevel();
			this.level.loadFromJSON(data.level_id, data.level_json);
			var res = this.level.getRequiredResources();
			if (res.length > 0) {
				this.loadResources(_getArrayForSQL(res));
			} else {
				this.start();
			}
		} else {
			console.log( data );
		}
	}
	
	this.startLoadingLevel = function( level_id ) {		
		this.ui.showLoading("Loading...");
		//this.resetHost3D();		
		this.resources = false;
		$.get("php/loadLevel.php",
			{level_id: level_id},
			_bind(this, this.levelLoaded)
		);		
	}

	this.selectLevel = function( level ) {
		this.resetUI();
		this.startLoadingLevel(level.level_id);		
	}
	
	this.levelLoadCancel = function() {
		if (this.levelList) {
			this.levelList.remove();
			this.levelList = false;
			this.ui.removeOverlay();
		}
	}
	
	this.showLevelList = function( levels_json ) {
		this.levelLoadCancel();
		this.ui.addOverlay();
		this.levelList = this.ui.addContainer()
			.css({left:"150px",right:"150px",top:"170px",bottom:"120px",opacity:1,position:"fixed",zIndex:"99999999999999"});
		
		if (levels_json.length > 0) {
			this.ui.addTable( levels_json, _bind(this, this.selectLevel), this.levelList ).css({margin:"auto"});
		} else {
			this.levelList.append("No levels available in weGGe database.");
		}
		
		this.ui.addMenu( {
				links: [
							{title:'Cancel',onselect:_bind(this, this.levelLoadCancel)},
						],
				css:{top:0,left:0},
				element:this.levelList
			}
		);
	}
	
	this.reloadLevel = function() {		
		this.resetUI();
		if (this.level && this.level.id) {
			this.startLoadingLevel(this.level.id);
		} else {
			console.log("No level loaded. Nothing  to reload.");
		}
	}
	
	this.loadLevelList = function() {
		$.get("php/loadLevels.php",			
			_bind(this, this.showLevelList)
		);
	}
	
	this.animationFrame = function(delta) {
		this.level.animationFrame(delta);
	}
	
	/* RESOURCES */
	
	this.resourcesLoaded = function( resources_json ) { 
		this.ui.showLoading("Initializing resources...");
		this.resources = new weggeResources();
		this.resources.loadFromJSON( resources_json );
		this.resources.onInitialized = _bind(this, this.start);
		this.resources.initialize();
	}		
	
	this.loadResources = function(ids) {
		if (this.resources) {
			this.resources.initialized = false;
		}
		this.ui.showLoading("Loading resources...");
		$.get("php/loadResources.php", 
			{ids:_coalesce(ids,'')},
			_bind(this, this.resourcesLoaded)
		);
	}
		
	document.addEventListener( 'keyup', _bind( this, this.onKeyUp ), false );
}



