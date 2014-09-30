<?php

	include 'global.php';
	
	global $db;
	
	$sceneID = _get('scene_id');
	
	$query = "SELECT * FROM scenes WHERE scene_id = $sceneID";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	if(mysql_num_rows($result)) {
		$scene = mysql_fetch_assoc($result);
	} else die("Scene $sceneID doesn't exist.");
	
	
	/* RESOURCES */
	$query = "SELECT * FROM resources WHERE resource_id IN (
				SELECT DISTINCT obr.resource_id 
				FROM object_resources obr
				JOIN scene_objects so on (obr.object_id = so.object_id)
				WHERE so.scene_id = $sceneID
			)";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$resources = array();
	if(mysql_num_rows($result)) {
		while($resource = mysql_fetch_assoc($result)) {
			$resources[] = $resource;
		}
	}
		
	/* OBJECTS */
	$query = "SELECT o.* FROM objects o
				JOIN scene_objects so on (o.object_id = so.object_id)
				WHERE so.scene_id = $sceneID;";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$objects = array();
	if(mysql_num_rows($result)) {
		while($object = mysql_fetch_assoc($result)) {
			$objects[] = $object;
		}
	}
	
	header('Content-type: application/json');
	echo json_encode(array('scene'=>$scene, 'resources'=>$resources, 'objects'=>$objects));
		
?>