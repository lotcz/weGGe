<?php

	include 'global.php';
	
	global $db;
		
	$query = "SELECT level_id, level_name as level_preview FROM levels";
	
	$result = $db->query($query) or die('SQL Error - '.$query);
		
	$levels = array();
	if(mysqli_num_rows($result)) {
		while($level = mysqli_fetch_assoc($result)) {
			$levels[] = $level;
		}
	}
	
	header('Content-type: application/json');
	echo json_encode($levels);
		
?>