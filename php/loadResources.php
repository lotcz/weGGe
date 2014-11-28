<?php

	include 'global.php';
	
	global $db;
	
	$ids = _get('ids');
	
	if (strlen($ids) > 0) {
		$query = "SELECT * FROM resources WHERE resource_id IN ( $ids )";
	} else {
		$query = "SELECT * FROM resources";
	}
	$result = $db->query($query) or die('SQL Error - '.$query);
		
	$resources = array();
	if(mysqli_num_rows($result)) {
		while($resource = mysqli_fetch_assoc($result)) {
			$resources[] = $resource;
		}
	}
	
	header('Content-type: application/json');
	echo json_encode($resources);
		
?>