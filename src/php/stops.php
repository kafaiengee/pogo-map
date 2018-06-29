<?php

require_once('common.php');

$query = 'SELECT * FROM stops';
// $query .= ' LIMIT 50';

if (isset($_GET['id'])) {
  $query = 'SELECT * FROM stops WHERE id = ' . $_GET['id'];
}

/* For testing only! */
// $query = 'SELECT * FROM gyms LIMIT 5';

$result = mysqli_query($dblink, $query) or die(mysqli_error($dblink));
$num_rows = mysqli_num_rows($result);

while ( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ) {
  $stop = array();
  $stop_id = '';
  
  foreach ($row as $stop_key => $stop_value) {
    $stop_key = trim((string)$stop_key);
    $stop_value = trim((string)$stop_value);
    
    if ($stop_key == 'id') {
      $stop_id = $stop_value;
    } else if ($stop_key == 'location_id') {
      $query2 = 'SELECT * FROM `locations` WHERE `id` = ' . $stop_value . ';';
      $result2 = mysqli_query($dblink, $query2) or die(mysqli_error($dblink));
      while ( $row = mysqli_fetch_array($result2, MYSQLI_ASSOC) ) {
        $location = array();
        $location_id = '';

        unset($row['id']);
        foreach ($row as $location_key => $location_value) {
          $location[$location_key] = $location_value;
        }
      }
      $stop['location'] = $location;
    } else if ($stop_key == 'quest_id') {
      // $raid = array();
      // if ($stop_value != '0') {
      //   // print_r($stop_key . ' => ' . $stop_value . "<br>\n");
      //   $query3 = 'SELECT * FROM `raids` WHERE `id` = ' . $stop_value . ';';
      //   $result3 = mysqli_query($dblink, $query3) or die(mysqli_error($dblink));
      //   while ( $row = mysqli_fetch_array($result3, MYSQLI_ASSOC) ) {
      //     $raid = array();
      //     $raid_id = '';

      //     // unset($row['id']);
      //     foreach ($row as $raid_key => $raid_value) {
      //       // $raid['now'] = time();
      //       // print_r($raid_key . ' => ' . $raid_value . "<br>\n");
      //       if (($raid_key == 'end') && (strtotime($raid_value) < time())) {
      //         $query4 = 'UPDATE `raids` SET `active` = 0 WHERE `id` = ' . $stop_value . ';';
      //         $result4 = mysqli_query($dblink, $query4) or die('gyms > ' . mysqli_error($dblink) . ' > ' . $query4);

      //         $raid = array();
      //         break;
      //       } else {
      //         $raid[$raid_key] = $raid_value;
      //       }
      //     }
      //   }
      // }

      // if (ISSET($raid['active'])) {
      //   if ((boolean)$raid['active'] == false) {
      //     $raid = array();
      //   }
      // }

      // $stop['raid'] = $raid;
    } else if ($stop_key == 'id') {
      $stop_id = $stop_value;
    } else {
      $stop[$stop_key] = $stop_value;
    }
  }
  
  $data[$stop_id] = $stop;
}

print_r(json_encode(utf8ize($data), JSON_FORCE_OBJECT));

json_last_error();
