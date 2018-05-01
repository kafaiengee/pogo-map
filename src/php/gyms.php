<?php

// header("Content-Type: application/json; charset=UTF-8");
require_once('common.php');


// Open Connection
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
  echo "Error: " . mysqli_connect_error();
  exit();
}

// $sql = 'SELECT json_object(\'id\', id, \'name\', name, \'latitude\', latitude, \'longitude\', longitude, \'region_1\', region_1, \'region_2\', region_2, \'region_3\', region_3, \'street\', street, \'number\', number, \'postal\', postal, \'img\', img, \'last_modified\', last_modified) FROM locations;';
$query = 'SELECT * FROM locations';

$result = mysqli_query($dblink, $query) or die(mysqli_error($dblink));
$num_rows = mysqli_num_rows($result);

// $table = array();
// $table = $result->fetch_all(MYSQLI_ASSOC);

// // $query = mysqli_query($con, $sql);

// // $table = [];
// // while ($row = mysqli_fetch_array($query, MYSQLI_ASSOC)) {
// //   array_push($table, $row);
// // }

// // // Close connection
// // mysqli_close ($con);

// // echo json_encode($table);
// print_r($table);

while ( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ) {
  $record = array();
  $domain = "unknown";
    
  foreach ($row as $spec_name => $spec_value) {
    $spec_name = trim((string)$spec_name);
    $spec_value = trim((string)$spec_value);
    
    if ($spec_name == "id") {
      $domain = $spec_value;
    } else {
      $record[$spec_name] = $spec_value;
    }
  }
  
  $data[$domain] = $record;
}

print_r(json_encode(utf8ize($data), JSON_FORCE_OBJECT));

json_last_error();