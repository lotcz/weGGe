<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>weGGe loader TEST</title>
		
	</head>
	
	<body>	
	</body>

	<script src="../lib/jquery.min.js" language="javascript"></script>
	<script src="../lib/three.js" language="javascript"></script>		
	<script src="../lib/OrbitControls.js"></script>
	<script src="../js/tools.js" language="javascript"></script>
	<script src="../js/host3d.js" language="javascript"></script>
		
	<script>
	
		var mixer;
		
		$(function () {
			var host = new weggeHost3D();
			host.renderer.setClearColor(0x101010);
			host.initScene({});
			host.camera.position.set(-1400,200,-1200);
			
			var ambient = new THREE.AmbientLight();
			ambient.color.setStyle('#F0F0F0');
			host.scene.add(ambient);
			
			var light = new THREE.SpotLight();
			light.color.setStyle('#cf10a0');
			light.name = 'Spot light';
			light.angle = 0.4;
			light.penumbra = 0.3;
			light.distance = 1500;
			light.intensity = 1;
			light.position.set(-10, 8, -5);
			light.castShadow = true;
			light.shadow.camera.near = 150;
			light.shadow.camera.far = 1500;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;				
			host.scene.add(light);
			
			var loader = new THREE.JSONLoader();		
			var flamingo;
			
			loader.load(
				'../res/models/flamingo.js',
				function ( geometry ) {
					var material = new THREE.MeshPhongMaterial( {
						color: 0xffffff,
						morphTargets: true,
						vertexColors: THREE.FaceColors,
						shading: THREE.FlatShading
					} );
					flamingo = new THREE.Mesh( geometry, material );
					flamingo.castShadow = true;
					flamingo.position.set(200, -200, 100);
					host.scene.add(flamingo);
					mixer = new THREE.AnimationMixer( flamingo );
					mixer.clipAction( geometry.animations[ 0 ] ).setDuration( 1 ).play();					
				}
			);

			var material = new THREE.MeshPhongMaterial({
				color:0x0000a0,
				shininess: 150,
				specular: 0xffffff,
				shading: THREE.SmoothShading
			});		
			var geometry = new THREE.BoxGeometry(1, 1, 1);	
			var box = new THREE.Mesh(geometry, material);
			box.castShadow = false;
			box.receiveShadow = true;
			box.scale.set(100, 100, 100);
			box.position.set(200, -300, 100);
			host.scene.add(box);
			
			host.onAnimationFrame = function (delta) {
				if (mixer) {
					mixer.update( delta );				
				}
			}		
			
			controls = new THREE.OrbitControls( host.camera, host.renderer.domElement );
			controls.target.set( 0, 0, 0 );
			controls.update();
				
			host.startRendering();			
		});
		
	</script>
		
</html>