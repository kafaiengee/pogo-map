<?php

$environment = ($_SERVER["SERVER_NAME"] == 'localhost') ? 'localhost' : ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') ? 'www.fieldraids.com' : 'fieldraids.com';
if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

/* DOT NOT EDIT & SHARE */

$dbhost = 'localhost';
$dbuser = 'root2';
$dbpass = 'astronaut';
$dbname = 'pogo-map';
$dblink = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

/* DOT NOT EDIT & SHARE */


function utf8ize($d) {
  if (is_array($d)) {
      foreach ($d as $k => $v) {
          $d[$k] = utf8ize($v);
      }
  } else if (is_string ($d)) {
      return utf8_encode($d);
  }
  return $d;
}
