<?php

if ($_SERVER["SERVER_NAME"] == 'fieldraids.com') {
  $environment = 'fieldraids.com';
} else if ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') {
  $environment = 'www.fieldraids.com';
} else {
  $environment = 'localhost';
}

if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

// date_default_timezone_set('Europe/Amsterdam');
date_default_timezone_set('GMT');

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
