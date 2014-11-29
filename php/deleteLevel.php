<?php

	include 'global.php';
	
	global $db;
	
	$levelID = _get('level_id');
	
	$query = "DELETE FROM levels WHERE level_id = $levelID";
	
	$result = $db->query($query) or die("SQL Error - " . mysqli_error($link));		
?>