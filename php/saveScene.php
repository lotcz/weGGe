<?php

	global $db;
	
	$sceneID = _get('scene_id');
	$scene_name = _get('scene_name');
	$scene_json = _get('scene_json');
	
	if (($sceneID == 0)||($sceneID == '')) {		
			$query = "INSERT INTO scenes (scene_name, scene_json) 
			VALUES ('$scene_name', '$scene_json');";
			$result = mysql_query($query,$db) or die('Debile query:  '.$query);
			$sceneID = mysql_insert_id();		
	} else {
		$query = "UPDATE scenes SET 
				scene_name = '$scene_name',
				scene_json = '$scene_json'		
			WHERE scene_id = $sceneID;";
		$result = mysql_query($query,$db) or die('Debile query:  '.$query);		
	}
	
	$scene_resources = _get('scene_resources');
	
	if ($scene_resources) {
		$query = "DELETE FROM scene_resources WHERE scene_id = $sceneID;";
		$result = mysql_query($query,$db) or die('Debile query:  '. $query);
		
		$resources = explode($scene_resources, ",");
		foreach $resources as $resource {
			$query = "INSERT INTO scene_resources (scene_id, resource_id) 
			VALUES ($sceneID, $resource);";
			$result = mysql_query($query,$db) or die('Debile query:  '.$query);
		}
	}
	
	echo $sceneID;
	
?>