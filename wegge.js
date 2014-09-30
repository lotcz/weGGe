var MAX_ANISOTROPY, DELTA;
var renderer, scene, controls, clock, stats, resources;
var hud, hud_loading, hud_menu, hud_resources, hud_resource;
	
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	scene.animationFrame( DELTA );
	controls.animationFrame( DELTA );
	scene.render( renderer );	
	stats.end();
};
	
function OnWindowResize() {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight - 1;
	renderer.setSize( WIDTH, HEIGHT );
	scene.onWindowResize( WIDTH, HEIGHT );
	controls.onWindowResize( WIDTH, HEIGHT );
	hud.onWindowResize( WIDTH, HEIGHT );
}
		
function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	//console.log("key:" + key);
	//scene.onKeyPress(key);
	//hud.onKeyPress(key);
	return false;
}

function startLoadingScene (sceneID) {
	$.getJSON( 'php/loadScene.php', {scene_id: sceneID })
	.done(function( json ) { 
		hud.message("Scene loaded: " + json.scene_name);
		scene = new weggeScene( json );
	})
	.fail(function( data ) {
		scene = new weggeScene( {} );		
	}).always( function (data) {
	
		var dilg = hud.newDialog( "Dialoguew");
		
		$( "#context-menu" ).css({width:"400px", top:"150px", left:"100px"}).removeClass("hidden").menu();
		
		var object = {"test":"value"};
		var form = hud.newForm( "Object", object );
		
		/* CONTROLS	*/	
		controls = new weggeControls({ "camera":scene.camera, element: document });
		controls.resetToDefault();
		controls.movementSpeed = 500;
		controls.lookEnabled = controls.movementEnabled = false;
		
		OnWindowResize();
		
		animationFrame();
	});
}

function openResourcesInHUD() {
	if (hud_resources) {
		hud_resources.show();
	} else {
		hud_resources = new hudResources({});
	}
}
	
function loadResources( sceneID ) {
	$.getJSON( 'php/loadResources.php', {scene_id: _coalesce(sceneID, 0) })
		.done(function( resources_json ) { 
			resources = new tingResources();
			resources.loadFromJSON( resources_json );
			resources.initialize();
		})
}

function saveResource( res ) {
	$.post("php/saveResource.php", { "resource_id":res.resource_id, "resource_json":res.getJSON() }, function (data) { hud.message("Resource saved:" + data); } );
}
	

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x101010 );
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );

	/* HUD */
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight - 5;
	hud = new weggeHUD( $("#hud") );
	hud.onWindowResize( WIDTH, HEIGHT );
	var loading_width = 350;
	var loading_height = 60;
	hud_loading = hud.newDialog().css( {top:Math.round((hud.height-loading_height)/2) + "px", left:Math.round((hud.width-loading_width)/2) + "px", height:loading_height+"px", width:loading_width+"px", textAlign:"center", lineHeight:loading_height+"px"}, "Loading");
	hud_loading.html("Loading...");
	
	/* SCENE */
	
	loadResources();
	startLoadingScene(0);
			
	/* stats */
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
	
	clock = new THREE.Clock(true);
			
});




				