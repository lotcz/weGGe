<?php

	$db = mysql_connect('localhost','root','') or die('Cannot connect to DB');
	mysql_select_db('wegge',$db) or die('Cannot select DB');

	function _redirect($page) {
		$host  = $_SERVER['HTTP_HOST'];
		$uri  = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		header("Location: http://$host$uri/$page");
	}
	
	function _get($name) {
		return isset($_GET[$name]) ? $_GET[$name] : (isset($_POST[$name]) ? $_POST[$name] : null);
	}
	
?>