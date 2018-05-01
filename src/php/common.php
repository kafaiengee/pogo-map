<?php

/* DOT NOT EDIT & SHARE */

$dbhost = 'localhost';
$dbuser = 'root';
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