<?php

	include 'global.php';
	
	global $db;
	
	$sceneID = _get('scene_id');
	
	if ($sceneID > 0) {
		$query = $query = "SELECT * FROM resources WHERE resource_id IN (
				SELECT DISTINCT sr.resource_id 
				FROM scene_resources sr
				WHERE sr.scene_id = $sceneID
			)";
	} else {
		$query = "SELECT * FROM resources";
	}
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
		
	$resources = array();
	if(mysql_num_rows($result)) {
		while($resource = mysql_fetch_assoc($result)) {
			$resources[] = $resource;
		}
	}
	
	header('Content-type: application/json');
	echo json_encode($resources);
		
?>