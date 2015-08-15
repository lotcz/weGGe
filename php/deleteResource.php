<?php

	include 'global.php';
	
	global $db;
		
	$resourceID = _get('resource_id');
	
	$query = "DELETE FROM resources WHERE resource_id = $resourceID";
	
	$result = $db->query($query) or die("SQL Error - " . mysqli_error($link));
