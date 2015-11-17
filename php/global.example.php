<?php

	// p: is for persistent db connection
	$db = mysqli_connect("p:localhost","login","password","dbname") or die("Error " . mysqli_error($link)); 

	function _redirect($page) {
		$host  = $_SERVER['HTTP_HOST'];
		$uri  = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		header("Location: http://$host$uri/$page");
	}
	
	function _get($name) {
		return isset($_GET[$name]) ? $_GET[$name] : (isset($_POST[$name]) ? $_POST[$name] : null);
	}
	
?>