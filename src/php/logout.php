<?php

$environment = ($_SERVER["SERVER_NAME"] == 'localhost') ? 'localhost' : ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') ? 'www.fieldraids.com' : 'fieldraids.com';
if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

// Initialize the session
session_start();
 
// Unset all of the session variables
$_SESSION = array();
 
// Destroy the session.
session_destroy();
 
// Redirect to login page
header("location: login.php");
exit;
?>
