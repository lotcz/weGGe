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
	<script src="../js/tools.js" language="javascript"></script>
	<script src="../js/host3d.js" language="javascript"></script>
		
	<script>
	
		$(function () {
			var host = new weggeHost3D();
			host.initScene({});
			host.camera.position.set(0,0,0);
			
			var light = new THREE.AmbientLight();
			light.color.setStyle('#ffffff');
			host.scene.add(light);
			
			var material = new THREE.MeshBasicMaterial({color:'#d0d0d0'});		
			var geometry = new THREE.BoxGeometry( 100, 100, 100 );	
			var box = new THREE.Mesh( geometry, material );			
			box.position.set(200, 200, 200);
			host.scene.add(box);
			
			host.lookAt(box.position);			
			host.startRendering();
		});
		
	</script>
		
</html>