function weggeHost3D() {	
	this.container = $("<div></div>").css({display:"block", position: "absolute", left: 0, top: 0, width:"100%", height:"100%"}).appendTo(document.body);
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor( 0x101010 );
	this.container.append(this.renderer.domElement);
	this.clock = new THREE.Clock(true);
	this.animationPaused = true;
	this.scene = new THREE.Scene();
	this.animated = [];
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 10000 );
	this.camera.position.set( 0, 0, 0 );
	this.camera.lookAt( new THREE.Vector3(10, 10, 10) );
	this.scene.add(this.camera);
	this.delta = 0;
	this.width = 320;
	this.height = 200;
	
	this.stats = new Stats();
	this.stats.setMode(0); // 0: fps, 1: ms
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.zIndex = 10000000;
	this.stats.domElement.style.left = '10px';
	this.stats.domElement.style.top = '10px';
	document.body.appendChild( this.stats.domElement );
	
	this.destroy = function () {
		this.stopAnimation();
		window.removeEventListener( 'resize',this.resizeClosure , false );
		this.container.remove();
		$(this.stats.domElement).remove();
	}
	
	this.startAnimation = function() {
		this.animationPaused = false;
		this.animationFrame();
	}

	this.stopAnimation = function() {
		this.animationPaused = true;
	}

	this.animationFrame = function() {	
		if (!this.animationPaused) {
			this.stats.begin();	
			requestAnimationFrame(_bind(this, this.animationFrame));	
			this.delta = this.clock.getDelta();
			if (this.onAnimationFrame) {
				this.onAnimationFrame(this.delta);
			}
			this.renderer.render( this.scene, this.camera );	
			this.stats.end();
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
	this.onWindowResize();
}				