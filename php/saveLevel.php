<?php

	include 'global.php';
	
	global $db;
	
	$levelID = _get('level_id');
	$level_name = _get('level_name');
	$level_json = _get('level_json');
	
	if (($levelID == 0)||($levelID == '0')||($levelID == '')||(!$levelID)) {		
			$query = "INSERT INTO levels (level_name,level_json) 
			VALUES ('$level_name','$level_json');";
			$result = $db->query($query) or die('SQL Error - '.$query);
			$levelID = mysqli_insert_id($db);		
	} else {
		$query = "UPDATE levels SET 
				level_json = '$level_json',
				level_name = '$level_name'		
			WHERE level_id = $levelID;";
		$result = $db->query($query) or die('SQL Error - '.$query);		
	}
		
	echo $levelID;
	
?>