<?php

	include 'global.php';
	
	global $db;
		
	$resourceID = _get('resource_id');
	$resource_json = _get('resource_json');;
	
	if (($resourceID == 0)||($resourceID == '')) {		
		$query = "INSERT INTO resources (resource_json) 
			VALUES ('$resource_json');";
		$result = $db->query($query) or die('SQL error - '.$query);
		$resourceID = mysqli_insert_id($db);		
	} else {
		$query = "UPDATE resources SET 
			resource_json = '$resource_json'		
			WHERE resource_id = $resourceID;";
		$result = $db->query($query) or die('SQL error - '.$query);		
	}
	
	echo $resourceID;