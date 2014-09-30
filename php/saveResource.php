<?php

	include 'global.php';
	
	global $db;
		
	$resourceID = _get('resource_id');
	$resource_json = _get('resource_json');;
	
	if (($resourceID == 0)||($resourceID == '')) {		
			$query = "INSERT INTO resources (resource_json) 
			VALUES ('$resource_json');";
			$result = mysql_query($query,$db) or die('Debile query:  '.$query);
			$resourceID = mysql_insert_id();		
	} else {
		$query = "UPDATE resources SET 
				resource_json = '$resource_json'		
			WHERE resource_id = $resourceID;";
		$result = mysql_query($query,$db) or die('Debile query:  '.$query);		
	}
	
	echo $resourceID;