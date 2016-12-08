<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>weGGe shadows TEST</title>
		
	</head>
	
	<body>	
	</body>

	<script src="../lib/jquery.min.js" language="javascript"></script>
	<script src="../lib/three.js" language="javascript"></script>	
	<script src="../lib/ShadowMapViewer.js" language="javascript"></script>
	<script src="../lib/UnpackDepthRGBAShader.js"></script>
	<script src="../lib/OrbitControls.js"></script>
	<script src="../js/tools.js" language="javascript"></script>
	<script src="../js/host3d.js" language="javascript"></script>
		
	<script>
	
		$(function () {
			var host = new weggeHost3D();
			host.renderer.setClearColor(0x101010);
			host.initScene({});
			host.camera.position.set(-1400,200,-1200);
			
			var ambient = new THREE.AmbientLight();
			ambient.color.setStyle('#202020');
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
			//host.scene.add(new THREE.SpotLightHelper(light));
			//host.scene.add( new THREE.CameraHelper( light.shadow.camera ) );

			var light2 = new THREE.SpotLight();
			light2.color.setStyle('#20cf20');
			light2.name = 'Spot light 2';
			light2.angle = 0.4;
			light2.penumbra = 0.3;
			light2.distance = 1500;
			light2.intensity = 1;
			light2.position.set(0, 150, 0);
			light2.castShadow = true;
			light2.shadow.camera.near = 150;
			light2.shadow.camera.far = 1500;
			light2.shadow.mapSize.width = 1024;
			light2.shadow.mapSize.height = 1024;				
			host.scene.add(light2);
			//host.scene.add(new THREE.SpotLightHelper(light2));
			//host.scene.add( new THREE.CameraHelper( light2.shadow.camera ) );
			
			dirLight = new THREE.DirectionalLight( 0xdfdfdf, 1 );
			dirLight.name = 'Dir. Light';
			dirLight.position.set( 0, 100, 0 );
			//dirLight.rotation.x = Math.PI * 0.5;
			dirLight.castShadow = true;
			dirLight.shadow.camera.near = 150;
			dirLight.shadow.camera.far = 400;
			dirLight.shadow.camera.right = 1000;
			dirLight.shadow.camera.left = - 1000;
			dirLight.shadow.camera.top	= 1000;
			dirLight.shadow.camera.bottom = - 1000;
			dirLight.shadow.mapSize.width = 1024;
			dirLight.shadow.mapSize.height = 1024;
			host.scene.add( dirLight );
			//host.scene.add(new THREE.DirectionalLightHelper(dirLight));
			//host.scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
						
			var material = new THREE.MeshPhongMaterial({
				color:0x0000a0,
				shininess: 150,
				specular: 0xffffff,
				shading: THREE.SmoothShading
			});		
			var geometry = new THREE.BoxGeometry(1, 1, 1);	
			var box = new THREE.Mesh(geometry, material);
			box.castShadow = true;
			box.receiveShadow = false;
			box.scale.set(100, 100, 100);
			box.position.set(200, -200, 100);
			host.scene.add(box);
			
			var ball_material = new THREE.MeshPhongMaterial({
				color:0xa000a0,
				shininess: 50,
				specular: 0xffffff,
				shading: THREE.SmoothShading
			});		
			var ball_geometry = new THREE.SphereGeometry(50, 16, 16);	
			var ball = new THREE.Mesh(ball_geometry, ball_material);
			ball.castShadow = true;
			ball.receiveShadow = false;
			ball.position.set(200, -200, 400);
			host.scene.add(ball);
			
			//host.lookAt(box.position);
			//light.lookAt(box.position);
			
			var ground_material = new THREE.MeshPhongMaterial({
				color:0xa0a0a0,
				shininess: 0,
				specular: 0xa0a0a0,
				shading: THREE.SmoothShading
			});		
			
			var ground = new THREE.Mesh( geometry, ground_material);			
			ground.castShadow = false;
			ground.receiveShadow = true;
			ground.scale.set(2000, 10, 2000);
			ground.position.set(0, -300, 0);
			host.scene.add(ground);
						
			host.render();
			
			spotLightShadowMapViewer = new THREE.ShadowMapViewer( light );
			spotLightShadowMapViewer.size.set( 256, 256 );
			spotLightShadowMapViewer.position.set( 276, 10 );
			
			spotLightShadowMapViewer2 = new THREE.ShadowMapViewer( light2 );
			spotLightShadowMapViewer2.size.set( 256, 256 );
			spotLightShadowMapViewer2.position.set( 542, 10 );
			
			dirLightShadowMapViewer = new THREE.ShadowMapViewer( dirLight );
			dirLightShadowMapViewer.position.x = 10;
			dirLightShadowMapViewer.position.y = 10;
			dirLightShadowMapViewer.size.width = 256;
			dirLightShadowMapViewer.size.height = 256;
			dirLightShadowMapViewer.update(); 
			
			var ball_time = 0;
			var ball_round = 1.25;
			light2.target = ball;
				
			host.onAnimationFrame = function (delta) {
				box.rotation.x += 0.3 * delta;
				box.rotation.y += 0.2 * delta;
				ball_time += delta;
				var ball_stage = ball_time / ball_round;
				ball.position.x = (Math.sin(ball_stage) * 500);
				ball.position.z = (Math.cos(ball_stage) * 500);
				
			}
			
			host.onPostRender = function () {
				dirLightShadowMapViewer.render( host.renderer );
				spotLightShadowMapViewer.render( host.renderer );
				spotLightShadowMapViewer2.render( host.renderer );
			}
			
			host.onWindowResize = function () {
				dirLightShadowMapViewer.updateForWindowResize();			
				spotLightShadowMapViewer.updateForWindowResize();
				spotLightShadowMapViewer2.updateForWindowResize();
			}
			
			controls = new THREE.OrbitControls( host.camera, host.renderer.domElement );
			controls.target.set( 0, 0, 0 );
			controls.update();
				
			host.startRendering();			
		});
		
	</script>
		
</html>