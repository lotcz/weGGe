function weggeHost3D() {	
	this.container = $("<div></div>").css({display:"block", position: "absolute", left: 0, top: 0, width:"100%", height:"100%"}).appendTo(document.body);
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor( 0x101010 );
	this.container.append(this.renderer.domElement);
	this.clock = new THREE.Clock(true);
	this.renderingPaused = true;	
	this.animationPaused = false;	
	this.physicsEnabled = false;
	this.physicsPaused = false;
	this.animated = [];	
	this.delta = 0;
	this.width = 320;
	this.height = 200;	
	this.stats = false;
	
	this.initState = function(json) {
		this.renderingPaused = _coalesce(json.renderingPaused,0);
		this.animationPaused = _coalesce(json.animationPaused,0);
		this.physicsPaused = _coalesce(json.physicsPaused,0);
		this.stateChanged();
	}
	
	this.initScene = function(json) {
		this.scene = new THREE.Scene();
		this.initCamera(json);
		this.onWindowResize();
		this.initialized = true;
		this.initState(json);		
	}
	
	this.updatePhysics = function(delta) {
		this.scene.simulate( delta, 2 );
	}
	
	this.lookAt = function(v) {
		if (this.camera) {
			this.camera.lookAt(v);
		}
	}
	
	this.initCamera = function(json) {		
		json = _coalesce(json,{});
		this.camera = new THREE.PerspectiveCamera( parseFloat(_coalesce(json.cameraFov,45)), parseFloat(_coalesce(json.cameraAspect,1)), parseFloat(_coalesce(json.cameraNear,1)), parseFloat(_coalesce(json.cameraFar,10000)) );
		this.scene.add(this.camera);
	}
	
	this.initScenePhysics = function(json) {
		this.scene = new Physijs.Scene;
		this.scene.setGravity(_arrayToVector(json.gravity));
		/*this.scene.addEventListener(
			'update',
			_bind(this, this.updatePhysics)
		);*/
		this.initCamera(json)
		this.onWindowResize();
		this.initialized = true;
		this.physicsEnabled = true;
		this.initState(json);
	}
	
	this.initStats = function() {
		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.zIndex = 10000000;
		this.stats.domElement.style.left = '10px';
		this.stats.domElement.style.top = '10px';
		document.body.appendChild( this.stats.domElement );
	}
	
	this.destroy = function () {
		this.stopRendering();
		this.initialized = false;
		window.removeEventListener( 'resize',this.resizeClosure , false );
		this.container.remove();
		$(this.stats.domElement).remove();
		this.stateChanged();
	}
	
	this.startRendering = function() {
		this.renderingPaused = false;
		this.animationFrame();
		this.stateChanged();
	}

	this.stopRendering = function() {
		this.renderingPaused = true;
		this.stateChanged();
	}

	this.toggleRendering = function() {
		if (this.renderingPaused) {
			this.startRendering();
		} else {
			this.stopRendering();
		}
	}
	
	this.startAnimation = function() {
		this.animationPaused = false;	
		this.stateChanged();		
	}

	this.stopAnimation = function() {
		this.animationPaused = true;
		this.stateChanged();
	}
	
	this.toggleAnimation = function() {
		if (this.animationPaused) {
			this.startAnimation();
		} else {
			this.stopAnimation();
		}
	}
	
	this.startPhysics = function() {
		this.physicsPaused = false;
		if (this.physicsEnabled) {
			this.updatePhysics();
		}
		this.stateChanged();
	}

	this.stopPhysics = function() {
		this.physicsPaused = true;
		this.stateChanged();
	}
	
	this.togglePhysics = function() {
		if (this.physicsPaused) {
			this.startPhysics();
		} else {
			this.stopPhysics();
		}
	}
	
	this.stateChanged = function() {
		if (this.onHost3DStateChanged) {
			this.onHost3DStateChanged();
		}
	}
	
	this.animationFrame = function() {	
		if (!this.renderingPaused) {
			if (this.stats) this.stats.begin();	
			requestAnimationFrame(_bind(this, this.animationFrame));	
			this.delta = this.clock.getDelta();
			if (this.physicsEnabled && !this.physicsPaused) {
				this.updatePhysics(this.delta);
			}
			if (this.onAnimationFrame && !this.animationPaused) {
				this.onAnimationFrame(this.delta);
			}
			this.renderer.render( this.scene, this.camera );	
			if (this.stats) this.stats.end();
		}
	}
	
	this.onWindowResize = function () {
		this.width = window.innerWidth;
		this.height = window.innerHeight - 5;
		this.renderer.setSize( this.width, this.height );
		if (this.camera) {
			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();	
		}
	}

	this.resizeClosure = _bind( this, this.onWindowResize);
	
	window.addEventListener( 'resize',this.resizeClosure, false );
	this.initialized = false;
}				