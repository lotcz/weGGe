<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<link href="ui.css" rel="stylesheet"/>
		<title>weGGe VIEWER TEST</title>
	</head>
	
	<body>	
	</body>

	<?php include 'php/js_includes.php' ?>
	
	<script>
	
		$(function () {
			var viewer = new weggeViewer();
			var cookie = _readCookie("level");
			if (cookie !== null) {
				viewer.startLoadingLevel(cookie);
			}
		});
		
	</script>
		
</html>

