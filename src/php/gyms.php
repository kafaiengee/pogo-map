<?php

require_once('common.php');

// $sql = 'SELECT json_object(\'id\', id, \'name\', name, \'latitude\', latitude, \'longitude\', longitude, \'region_1\', region_1, \'region_2\', region_2, \'region_3\', region_3, \'street\', street, \'number\', number, \'postal\', postal, \'img\', img, \'last_modified\', last_modified) FROM locations;';
$query = 'SELECT * FROM gyms LIMIT 5';

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

          unset($row['id']);
          foreach ($row as $raid_key => $raid_value) {
            // print_r($raid_key . ' => ' . $raid_value . "<br>\n");
            $raid[$raid_key] = $raid_value;
          }
        }
      }
      // $gym[$gym_key] = $raid;
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