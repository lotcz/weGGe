<?php

	include 'global.php';
	
	global $db;
		
	$resource_id = _get('resource_id');
	$resource_name = _get('resource_name');
	$resource_json = _get('resource_json');;
	
	if (($resource_id == 0)||($resource_id == '')) {		
		$query = "INSERT INTO resources (resource_name,resource_json) 
			VALUES ('$resource_name', '$resource_json');";
		$result = $db->query($query) or die('SQL error - '.$query);
		$resource_id = mysqli_insert_id($db);		
	} else {
		$query = "UPDATE resources SET 
			resource_json = '$resource_json',
			resource_name = '$resource_name'
			WHERE resource_id = $resource_id;";
		$result = $db->query($query) or die('SQL error - '.$query);		
	}
	
	echo $resource_id;