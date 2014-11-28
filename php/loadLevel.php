<?php

	include 'global.php';
	
	global $db;
	
	$levelID = _get('level_id');
	
	$query = "SELECT * FROM levels WHERE level_id = $levelID";
	
	$result = $db->query($query) or die("SQL Error - " . mysqli_error($link));

	if(mysqli_num_rows($result)) {
		$level = mysqli_fetch_assoc($result);
	} else die("Level $levelID doesn't exist.");
	
	header('Content-type: application/json');
	echo "{\"level_id\":" . "\"" . $level['level_id'] . "\", \"level_json\": " . $level['level_json'] . "}";
		
?>