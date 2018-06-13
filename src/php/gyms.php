<?php

$environment = ($_SERVER["SERVER_NAME"] == 'localhost') ? 'localhost' : ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') ? 'www.fieldraids.com' : 'fieldraids.com';
if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

require_once('common.php');

// $sql = 'SELECT json_object(\'id\', id, \'name\', name, \'latitude\', latitude, \'longitude\', longitude, \'region_1\', region_1, \'region_2\', region_2, \'region_3\', region_3, \'street\', street, \'number\', number, \'postal\', postal, \'img\', img, \'last_modified\', last_modified) FROM locations;';
$query = 'SELECT * FROM gyms';

if (isset($_GET['id'])) {
  $query = 'SELECT * FROM gyms WHERE id = ' . $_GET['id'];
}

/* For testing only! */
// $query = 'SELECT * FROM gyms LIMIT 5';

$result = mysqli_query($dblink, $query) or die(mysqli_error($dblink));
$num_rows = mysqli_num_rows($result);

while ( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ) {
  $gym = array();
  $gym_id = '';
  
  foreach ($row as $gym_key => $gym_value) {
    $gym_key = trim((string)$gym_key);
    $gym_value = trim((string)$gym_value);
    
    if ($gym_key == 'id') {
      $gym_id = $gym_value;
    } else if ($gym_key == 'location_id') {
      $query2 = 'SELECT * FROM `locations` WHERE `id` = ' . $gym_value . ';';
      $result2 = mysqli_query($dblink, $query2) or die(mysqli_error($dblink));
      while ( $row = mysqli_fetch_array($result2, MYSQLI_ASSOC) ) {
        $location = array();
        $location_id = '';

        unset($row['id']);
        foreach ($row as $location_key => $location_value) {
          // print_r($location_key . ' => ' . $location_value . "<br>\n");
          $location[$location_key] = $location_value;
        }
      }
      // $gym[$gym_key] = $location;
      $gym['location'] = $location;
    } else if ($gym_key == 'raid_id') {
      $raid = array();
      if ($gym_value != '0') {
        // print_r($gym_key . ' => ' . $gym_value . "<br>\n");
        $query3 = 'SELECT * FROM `raids` WHERE `id` = ' . $gym_value . ';';
        $result3 = mysqli_query($dblink, $query3) or die(mysqli_error($dblink));
        while ( $row = mysqli_fetch_array($result3, MYSQLI_ASSOC) ) {
          $raid = array();
          $raid_id = '';

          // unset($row['id']);
          foreach ($row as $raid_key => $raid_value) {
            // $raid['now'] = time();
            // print_r($raid_key . ' => ' . $raid_value . "<br>\n");
            if (($raid_key == 'end') && (strtotime($raid_value) < time())) {
              $query4 = 'UPDATE `raids` SET `active` = 0 WHERE `id` = ' . $gym_value . ';';
              $result4 = mysqli_query($dblink, $query4) or die('gyms > ' . mysqli_error($dblink) . ' > ' . $query4);

              $raid = array();
              break;
            } else {
              $raid[$raid_key] = $raid_value;
            }
          }
        }
      }

      if (ISSET($raid['active'])) {
        if ((boolean)$raid['active'] == false) {
          $raid = array();
        }
      }

      $gym['raid'] = $raid;
    } else if ($gym_key == 'id') {
      $gym_id = $gym_value;
    } else {
      $gym[$gym_key] = $gym_value;
    }
  }
  
  $data[$gym_id] = $gym;
}

print_r(json_encode(utf8ize($data), JSON_FORCE_OBJECT));

json_last_error();
